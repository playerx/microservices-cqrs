import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Message, Metadata, Queue, QueueItem } from '../../queue'
import { CqrsTokens } from '../cqrs.tokens'

export interface EventBusOptions {
  listenRoutePrefixes?: string[]
}

@Injectable()
export class EventBus<TEvent extends Message<TEvent>> {
  private name: string
  private event$: Observable<QueueItem<TEvent>>

  constructor(
    @Inject(CqrsTokens.Queue)
    private queue: Queue,

    @Inject(CqrsTokens.EventBusOptions)
    options?: EventBusOptions,
  ) {
    this.name = this.queue.name

    const listenPrefixes = options?.listenRoutePrefixes ?? [
      `Event.`,
      //   `DirectEvent.${this.name}`,
    ]

    this.event$ = this.queue.message$.pipe(
      filter(x =>
        listenPrefixes.some(prefix => x.route.startsWith(prefix)),
      ),
    )
  }

  publish(event: TEvent, metadata?: Metadata) {
    this.queue.publish({
      route: `Event.${event.$type}`,
      message: event,
      metadata: {
        ...metadata,
        source: this.name,
      },
    })
  }

  subscribe(
    action: (query: TEvent, metadata: Metadata) => Promise<void>,
  ) {
    this.event$
      .pipe(takeUntil(this.queue.unsubscribe$))
      .subscribe(async x => {
        try {
          await action(<any>x.message, x.metadata ?? {})

          x.complete()
        } catch (err) {
          console.error(err)
          x.complete(false)
        }
      })
  }
}
