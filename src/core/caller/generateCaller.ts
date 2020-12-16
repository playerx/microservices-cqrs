import { ICqrsBus } from '../cqrs/bus/interfaces/bus.interface'
import { ICqrsService } from '../types'
import { buildRouteKey } from '../utility/routeKey/buildRouteKey'
import { IRouteKeyParts } from '../utility/routeKey/types'

// generate caller interface
export function generateCaller(
  serviceBase: ICqrsService,
  callerDetails: Omit<IRouteKeyParts, 'functionName'>,
  bus: ICqrsBus<any, any>,
) {
  return new Proxy(serviceBase, {
    get: (target, propKey, reciever) => {
      if (
        !Reflect.has(target.prototype, propKey) ||
        propKey === 'constructor'
      ) {
        return undefined
      }

      const route: IRouteKeyParts = {
        ...callerDetails,
        functionName: propKey.toString(),
      }
      console.log('Calling CQRS', route)
      return (...props) =>
        bus.publish(route, props).catch(err => {
          if (err === 'QUEUE_RPC_TIMEOUT') {
            // take the implementation from the abstract
            const fn = Reflect.get(
              target.prototype,
              propKey,
              reciever,
            )
            return fn(...props)
          } else {
            throw err
          }
        })
    },
  })
}
