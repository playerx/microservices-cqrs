import { CqrsBusType } from '../cqrs.tokens'
import { COMMAND_HANDLER_METADATA } from './constants'
import {
  IHandlerMetadata,
  IHandlerPrivateMetadata,
} from './interfaces'

export function CommandHandler(
  commandHandlerMetadata: IHandlerMetadata,
): ClassDecorator {
  return function decorateCommandHandler(target) {
    Reflect.defineMetadata(
      COMMAND_HANDLER_METADATA,
      <IHandlerPrivateMetadata>{
        ...commandHandlerMetadata,
        busType: CqrsBusType.Command,
      },
      target,
    )
    return target
  }
}
