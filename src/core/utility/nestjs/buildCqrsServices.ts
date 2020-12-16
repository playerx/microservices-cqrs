import {
  Abstract,
  ClassProvider,
  FactoryProvider,
  Provider,
  Type,
} from '@nestjs/common'
import { generateCaller } from '../../caller/generateCaller'
import { CommandBus } from '../../cqrs/bus/command.bus'
import { ICqrsBus } from '../../cqrs/bus/interfaces/bus.interface'
import { QueryBus } from '../../cqrs/bus/query.bus'
import { ICqrsService } from '../../types'

export function buildCqrsServices({
  queryServices = [],
  commandServices = [],
}: Args): Provider[] {
  const cqrsServices = [
    ...queryServices.map(service => useCqrs(service, QueryBus)),
    ...commandServices.map(service => useCqrs(service, CommandBus)),
  ]

  return cqrsServices
}

function useCqrs(
  baseService: Type<ICqrsService> | Abstract<ICqrsService>,
  busToken: Type<ICqrsBus<any, any>>,
): FactoryProvider {
  return {
    provide: baseService,
    useFactory: (injectedBus: ICqrsBus) =>
      generateCaller(
        baseService,
        {
          busType: injectedBus.__type,
          serviceName: baseService.name,
        },
        injectedBus,
      ),
    inject: [busToken],
  }
}

interface Args {
  queryServices?: (Type<ICqrsService> | Abstract<ICqrsService>)[]
  commandServices?: (Type<ICqrsService> | Abstract<ICqrsService>)[]
}
