import { CqrsBusType } from '../cqrs.tokens'
import { QUERY_HANDLER_METADATA } from './constants'
import {
  IHandlerMetadata,
  IHandlerPrivateMetadata,
} from './interfaces'

export function QueryHandler(
  commandHandlerMetadata: IHandlerMetadata,
): ClassDecorator {
  return function decorateQueryHandler(target) {
    Reflect.defineMetadata(
      QUERY_HANDLER_METADATA,
      <IHandlerPrivateMetadata>{
        ...commandHandlerMetadata,
        busType: CqrsBusType.Query,
      },
      target,
    )
    return target
  }
}
