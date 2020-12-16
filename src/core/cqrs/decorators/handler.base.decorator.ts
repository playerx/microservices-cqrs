import { CqrsBusType } from '../cqrs.tokens'
import {
  COMMAND_HANDLER_METADATA,
  HANDLER_ARGS_LENGTH,
  HANDLER_TYPE_METADATA,
} from './constants'
import {
  IHandlerMetadata,
  IHandlerPrivateMetadata,
} from './interfaces'

export function CqrsHandler(
  handlerMetadata: IHandlerMetadata,
  __type: CqrsBusType,
): ClassDecorator {
  return function decorateHandler(target) {
    // set the handler metadata on the handling class, so it can be found by the publicApi class name later
    Reflect.defineMetadata(
      HANDLER_TYPE_METADATA[__type],
      <IHandlerPrivateMetadata>{
        ...handlerMetadata,
        busType: __type,
      },
      target,
    )

    // for each function in the public api, store the number of args required, to limit the arg length in the future
    const fns = Reflect.ownKeys(handlerMetadata.publicApi.prototype)

    const argsLengthTuples = fns
      .map(prop => {
        if (prop === 'constructor') {
          return
        }
        const fn = Reflect.get(
          handlerMetadata.publicApi.prototype,
          prop,
        )
        if (typeof fn !== 'function') {
          return
        }
        // return the prop name and the length of the args
        return [prop, fn.length]
      })
      .filter(x => !!x) as [string, number][]

    Reflect.defineMetadata(
      HANDLER_ARGS_LENGTH,
      Object.fromEntries(argsLengthTuples),
      target,
    )

    return target
  }
}
