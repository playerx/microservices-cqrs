import { Inject, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { TPayload, TMetadata, Queue, QueueItem } from '../../queue'
import { buildRouteKey } from '../../utility/routeKey/buildRouteKey'
import { deconstructRouteKey } from '../../utility/routeKey/deconstructRouteKey'
import { IRouteKeyParts } from '../../utility/routeKey/types'
import { CqrsBusType, CqrsTokens } from '../cqrs.tokens'
import {
  ICqrsBus,
  IEventBus,
  TEvent,
} from './interfaces/bus.interface'

export interface EventBusOptions {
  listenRoutePrefixes?: string[]
}

@Injectable()
export class EventBus<TMessage extends TEvent = TEvent>
  implements IEventBus<TMessage> {
  readonly __type = CqrsBusType.Event
  private name: string
  private event$: Observable<QueueItem<TMessage>>

  constructor(
    @Inject(CqrsTokens.Queue)
    private queue: Queue,

    @Inject(CqrsTokens.EventBusOptions)
    options?: EventBusOptions,
  ) {
    this.name = this.queue.name

    const listenPrefixes = options?.listenRoutePrefixes ?? [
      `${this.__type}.`,
      //   `DirectEvent.${this.name}`,
    ]

    this.event$ = this.queue.message$.pipe(
      filter(x =>
        listenPrefixes.some(prefix => x.route.startsWith(prefix)),
      ),
    )
  }

  async publish(event: TMessage, metadata?: TMetadata) {
    await this.queue.publish({
      route: buildRouteKey({
        busType: CqrsBusType.Event,
        functionName: event.__type,
        serviceName: '',
      }),
      message: event,
      metadata: {
        ...metadata,
        source: this.name,
      },
    })
    return true
  }

  subscribe(
    action: (
      route: IRouteKeyParts,
      query: TMessage,
      metadata: TMetadata,
    ) => Promise<void>,
  ) {
    this.event$
      .pipe(takeUntil(this.queue.unsubscribe$))
      .subscribe(async x => {
        const route = deconstructRouteKey(x.route)
        try {
          await action(route, <any>x.message, x.metadata ?? {})

          x.complete()
        } catch (err) {
          console.error(err)
          x.complete(false)
        }
      })
  }
}
