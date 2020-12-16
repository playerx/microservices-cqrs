import { CqrsBusType } from '../../cqrs.tokens'
import { TPayload, TMetadata } from '../../../queue'
import { IRouteKeyParts } from '../../../utility/routeKey/types'

export interface ICqrsBus<
  TMessage extends TPayload<TMessage> = TPayload<any>,
  TMeta extends TMetadata = TMetadata
> {
  readonly __type: CqrsBusType
  publish<TResult>(
    route: IRouteKeyParts,
    payload: TMessage,
    metadata?: TMeta,
  ): Promise<TResult>
  subscribe(
    action: (
      route: Partial<IRouteKeyParts>,
      payload: TMessage,
      metadata: TMeta,
    ) => Promise<unknown>,
  ): void
}

export interface IEventBus<
  TMessage extends TEvent = TEvent,
  TMeta extends TMetadata = TMetadata
> {
  readonly __type: CqrsBusType
  publish(payload: TMessage, metadata?: TMetadata): Promise<boolean>
  subscribe(
    action: (
      route: Partial<IRouteKeyParts>,
      payload: TMessage,
      metadata: TMetadata,
    ) => Promise<unknown>,
  ): void
}

export type TEvent = {
  __type: string
}
