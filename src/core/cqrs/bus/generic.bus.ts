import { Inject } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import {
  TPayload as TPayloadData,
  TMetadata,
  Queue,
  QueueItem,
} from '../../queue'
import { buildRouteKey } from '../../utility/routeKey/buildRouteKey'
import { deconstructRouteKey } from '../../utility/routeKey/deconstructRouteKey'
import { IRouteKeyParts } from '../../utility/routeKey/types'
import { CqrsBusType, CqrsTokens } from '../cqrs.tokens'
import { ICqrsBus } from './interfaces/bus.interface'

export interface CommandBusOptions {}

export abstract class GenericBus<
  TPayload extends TPayloadData<TPayload>
> implements ICqrsBus<TPayload> {
  abstract __type: CqrsBusType
  private name: string

  private bus$: Observable<QueueItem<TPayload>>

  constructor(
    @Inject(CqrsTokens.Queue)
    protected queue: Queue,
  ) {
    this.name = this.queue.name

    this.bus$ = this.queue.message$.pipe(
      filter(x => x.route.startsWith(this.__type)),
    )
  }

  publish<TResult>(
    route: IRouteKeyParts,
    command: TPayload,
    metadata?: TMetadata,
  ) {
    return this.queue.publish<TResult>({
      route: buildRouteKey(route),
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
      route: Partial<IRouteKeyParts>,
      command: TPayload,
      metadata: TMetadata,
    ) => Promise<unknown>,
  ) {
    this.bus$
      .pipe(takeUntil(this.queue.unsubscribe$))
      .subscribe(async x => {
        try {
          const route = deconstructRouteKey(x.route)
          const result = await action(
            route,
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
