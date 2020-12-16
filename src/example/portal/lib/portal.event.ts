import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { UserCommandCqrs } from '../../user/shared/user.command.shared'
import { UserQueryCqrs } from '../../user/shared/user.query.shared'

export type PortalEvent = {
  __type: 'Portal.FinishedJob'
}

@Injectable()
export class PortalEventListener {
  constructor(
    private eventBus: EventBus<PortalEvent>,
    private userQuery: UserQueryCqrs,
    private userCommand: UserCommandCqrs,
  ) {}

  async onApplicationBootstrap() {
    this.eventBus.subscribe(async () => {})

    setTimeout(async () => {
      const userId = await this.userCommand.register({
        firstName: 'Ezeki',
        lastName: 'Zibzibadze',
      })

      const user = await this.userQuery.byId({ id: userId })

      console.log('PortalInit.onModuleInit', 'Registered User', user)
    }, 1000)
  }
}
