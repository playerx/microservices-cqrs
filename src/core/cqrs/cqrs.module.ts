import { Abstract, DynamicModule, Module } from '@nestjs/common'
import 'reflect-metadata'
import { Queue } from '../queue'
import { ICqrsService } from '../types'
import { buildCqrsServices } from '../utility/nestjs/buildCqrsServices'
import { CommandBus, CommandBusOptions } from './bus/command.bus'
import { EventBus, EventBusOptions } from './bus/event.bus'
import { QueryBus, QueryBusOptions } from './bus/query.bus'
import { CqrsTokens } from './cqrs.tokens'
import { HandlerDiscoveryService } from './services/handlerDiscovery.service'

@Module({
  providers: [
    QueryBus,
    CommandBus,
    EventBus,
    HandlerDiscoveryService,
  ],
  exports: [QueryBus, CommandBus, EventBus],
})
export class CqrsModule {
  static forRoot(options: {
    queue: Queue
    commandBusOptions?: CommandBusOptions
    queryBusOptions?: QueryBusOptions
    eventBusOptions?: EventBusOptions
    queryServices?: (ICqrsService | Abstract<ICqrsService>)[]
    commandServices?: (ICqrsService | Abstract<ICqrsService>)[]
  }): DynamicModule {
    const cqrsServices = buildCqrsServices(options)
    return {
      module: CqrsModule,
      providers: [
        { provide: CqrsTokens.Queue, useValue: options.queue },
        {
          provide: CqrsTokens.CommandBusOptions,
          useValue: options.commandBusOptions ?? {},
        },
        {
          provide: CqrsTokens.QueryBusOptions,
          useValue: options.queryBusOptions ?? {},
        },
        {
          provide: CqrsTokens.EventBusOptions,
          useValue: options.eventBusOptions ?? {},
        },
        ...cqrsServices,
      ],
      exports: [...cqrsServices],
    }
  }
}
