import { DynamicModule, Module } from '@nestjs/common'
import 'reflect-metadata'
import { Queue } from '../queue'
import { CommandBus, CommandBusOptions } from './bus/command.bus'
import { EventBus, EventBusOptions } from './bus/event.bus'
import { QueryBus, QueryBusOptions } from './bus/query.bus'
import { CqrsTokens } from './cqrs.tokens'

@Module({
  providers: [QueryBus, CommandBus, EventBus],
  exports: [QueryBus, CommandBus, EventBus],
})
export class CqrsModule {
  static forRoot(options: {
    queue: Queue
    commandBusOptions?: CommandBusOptions
    queryBusOptions?: QueryBusOptions
    eventBusOptions?: EventBusOptions
  }): DynamicModule {
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
      ],
    }
  }
}
