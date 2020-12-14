import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Message, Metadata, Queue, QueueItem } from '../../queue'
import { CqrsTokens } from '../cqrs.tokens'

export interface CommandBusOptions {}

@Injectable()
export class CommandBus<TCommand extends Message<TCommand>> {
  private name: string

  private command$: Observable<QueueItem<TCommand>>

  constructor(
    @Inject(CqrsTokens.Queue)
    private queue: Queue,

    @Inject(CqrsTokens.CommandBusOptions)
    options?: CommandBusOptions,
  ) {
    this.name = this.queue.name

    const listenPrefix = `Command.${this.name}`

    this.command$ = this.queue.message$.pipe(
      filter(x => x.route.startsWith(listenPrefix)),
    )
  }

  publish<TResult>(command: TCommand, metadata?: Metadata) {
    return this.queue.publish<TResult>({
      route: `Command.${command.$type}`,
      message: command,
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
    action: (
      command: TCommand,
      metadata: Metadata,
    ) => Promise<unknown>,
  ) {
    this.command$
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
          x.complete(false)
        }
      })
  }
}
