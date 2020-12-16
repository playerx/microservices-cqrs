import { CqrsBusType } from '../cqrs.tokens'
import { CqrsHandler } from './handler.base.decorator'
import { IHandlerMetadata } from './interfaces'

/**
 * Makes this class responsible for handling commands from the command queue, based on the publicApi provided.
 *
 * For any function handled from the publicApi, one _additional_ parameter will be provided at the end: the CqrsContext metadata.
 * This also means that the incoming arguments will always be sliced to the length of the arguments list in the publicApi class
 * @param commandHandlerMetadata
 */
export function CommandHandler(
  commandHandlerMetadata: IHandlerMetadata,
): ClassDecorator {
  return CqrsHandler(commandHandlerMetadata, CqrsBusType.Command)
}
