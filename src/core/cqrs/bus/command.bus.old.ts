import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { TPayload, TMetadata, Queue, QueueItem } from '../../queue'
import { CqrsBusType, CqrsTokens } from '../cqrs.tokens'
import { ICommandBus } from './interfaces/commandBus.interface'

export interface CommandBusOptions {}

@Injectable()
export class CommandBus<TCommand extends TPayload<TCommand>>
  implements ICommandBus<TCommand> {
  readonly __type = CqrsBusType.Command
  private name: string

  private command$: Observable<QueueItem<TCommand>>

  constructor(
    @Inject(CqrsTokens.Queue)
    private queue: Queue,

    @Inject(CqrsTokens.CommandBusOptions)
    options?: CommandBusOptions,
  ) {
    this.name = this.queue.name

    const listenPrefix = CqrsBusType.Command

    this.command$ = this.queue.message$.pipe(
      filter(x => x.route.startsWith(listenPrefix)),
    )
  }

  publish<TResult>(command: TCommand, metadata?: TMetadata) {
    return this.queue.publish<TResult>({
      route: `${command.$type}`,
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
      metadata: TMetadata,
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
