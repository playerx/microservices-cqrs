import { ICqrsBus } from '../cqrs/bus/interfaces/bus.interface'
import { HANDLER_ARGS_LENGTH } from '../cqrs/decorators/constants'
import { TPayload } from '../queue/types'

export function generateHandlers(
  serviceMap: Map<string, Object>,
  bus: ICqrsBus<any, any>,
) {
  bus.subscribe((route, payload: TPayload<any>, metadata) => {
    const { functionName, serviceName } = route
    if (serviceName && serviceMap.has(serviceName)) {
      const service = serviceMap.get(serviceName)
      if (
        !!service &&
        functionName &&
        Reflect.has(service, functionName)
      ) {
        // get handler metadata
        const fn = Reflect.get(
          service,
          functionName,
          service,
        ) as Function
        const argsLengthMap = Reflect.getMetadata(
          HANDLER_ARGS_LENGTH,
          service.constructor,
        )
        const publicApiArgsLength =
          Reflect.get(argsLengthMap, functionName) ?? 0

        const limitedArgs = (payload as unknown[]).slice(
          0,
          publicApiArgsLength,
        )
        return fn.apply(service, [
          // this limits the payload args length to match the public api
          ...limitedArgs,
          metadata,
        ])
      }
    }
  })
}
