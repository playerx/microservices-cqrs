import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Message, Metadata, Queue, QueueItem } from '../../queue'
import { CqrsTokens } from '../cqrs.tokens'

export interface QueryBusOptions {
  listenRoutePrefixes?: string[]
}

@Injectable()
export class QueryBus<TQuery extends Message<TQuery>> {
  private name: string
  private query$: Observable<QueueItem<TQuery>>

  constructor(
    @Inject(CqrsTokens.Queue)
    private queue: Queue,

    @Inject(CqrsTokens.QueryBusOptions)
    options?: QueryBusOptions,
  ) {
    this.name = this.queue.name

    const listenPrefixes = options?.listenRoutePrefixes ?? [
      `Query.${this.name}`,
    ]

    this.query$ = this.queue.message$.pipe(
      filter(x =>
        listenPrefixes.some(prefix => x.route.startsWith(prefix)),
      ),
    )
  }

  publish<TResult>(query: TQuery, metadata?: Metadata) {
    return this.queue.publish<TResult>({
      route: `Query.${query.$type}`,
      message: query,
      metadata: {
        ...metadata,
        source: this.name,
      },
      rpc: {
        enabled: true,
        timeout: 1000,
      },
    })
  }

  subscribe(
    action: (query: TQuery, metadata: Metadata) => Promise<unknown>,
  ) {
    this.query$
      .pipe(takeUntil(this.queue.unsubscribe$))
      .subscribe(async x => {
        try {
          const result = await action(
            <any>x.message,
            x.metadata ?? {},
          )

          x.complete()

          if (x.replyTo) {
            x.sendReply(result, {
              source: this.name,
            })
          }
        } catch (err) {
          // Still complete, we don't need to keep Query messages in the queue
          x.complete()
        }
      })
  }
}
