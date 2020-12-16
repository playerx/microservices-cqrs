import { ICqrsBus } from '../cqrs/bus/interfaces/bus.interface'
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
        const fn = Reflect.get(
          service,
          functionName,
          service,
        ) as Function

        return fn.apply(service, payload)
      }
    }
  })
}
