import {
  Inject,
  Injectable,
  OnModuleInit,
  Type,
} from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { Module } from '@nestjs/core/injector/module'
import { ModulesContainer } from '@nestjs/core/injector/modules-container'
import { generateHandlers } from '../../handler/generateHandlers'
import { Queue } from '../../queue/types'
import { ICqrsService } from '../../types'
import { CommandBus } from '../bus/command.bus'
import { EventBus } from '../bus/event.bus'
import { QueryBus } from '../bus/query.bus'
import { CqrsBusType, CqrsTokens } from '../cqrs.tokens'
import {
  COMMAND_HANDLER_METADATA,
  EVENT_HANDLER_METADATA,
  QUERY_HANDLER_METADATA,
} from '../decorators/constants'
import { IHandlerPrivateMetadata } from '../decorators/interfaces'

@Injectable()
export class HandlerDiscoveryService implements OnModuleInit {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private moduleRef: ModuleRef,
    private commandBus: CommandBus<any>,
    private queryBus: QueryBus<any>,
    @Inject(CqrsTokens.Queue)
    private queue: Queue,
  ) {}

  onModuleInit() {
    const { commands, queries } = this.discover()

    this.makeHandlers(CqrsBusType.Command, commands)
    this.makeHandlers(CqrsBusType.Query, queries)
  }

  private makeHandlers(type: CqrsBusType, services: ICqrsService[]) {
    const bus =
      type === CqrsBusType.Query ? this.queryBus : this.commandBus

    const metadataKey =
      type === CqrsBusType.Query
        ? QUERY_HANDLER_METADATA
        : COMMAND_HANDLER_METADATA

    const mapContents = services.map<[string, any]>(s => {
      const instance = this.moduleRef.get(s as any, { strict: false })
      const metadata: IHandlerPrivateMetadata = Reflect.getMetadata(
        metadataKey,
        instance.constructor,
      )

      return [metadata.publicApi.name, instance]
    })

    const map = new Map(mapContents)
    generateHandlers(map, bus)
    map.forEach((_, name) =>
      this.queue.subscribe({
        busType: type,
        serviceName: name,
      }),
    )
  }

  //#region discovery

  discover() {
    const modules = [...this.modulesContainer.values()]
    const commands = this.filterModuleProviders<ICqrsService>(
      modules,
      instance =>
        this.filterProvider(instance, COMMAND_HANDLER_METADATA),
    )
    const queries = this.filterModuleProviders<ICqrsService>(
      modules,
      instance =>
        this.filterProvider(instance, QUERY_HANDLER_METADATA),
    )
    const events = this.filterModuleProviders<ICqrsService>(
      modules,
      instance =>
        this.filterProvider(instance, EVENT_HANDLER_METADATA),
    )

    return { commands, queries, events }
  }

  filterModuleProviders<T>(
    modules: Module[],
    callback: (instance: InstanceWrapper) => Type<any> | undefined,
  ): Type<T>[] {
    return modules.flatMap<Type<T>>(
      module =>
        [...module.providers.values()]
          .map(callback)
          .filter(x => !!x) as Type<T>[],
    )
  }

  filterProvider(
    wrapper: InstanceWrapper,
    metadataKey: string,
  ): Type<any> | undefined {
    const { instance } = wrapper
    if (!instance) {
      return undefined
    }
    return this.extractMetadata(instance, metadataKey)
  }

  extractMetadata(
    instance: Record<string, any>,
    metadataKey: string,
  ): Type<any> | undefined {
    if (!instance.constructor) {
      return undefined
    }
    const metadata = Reflect.getMetadata(
      metadataKey,
      instance.constructor,
    )
    return metadata ? (instance.constructor as Type<any>) : undefined
  }
  //#endregion discovery
}
