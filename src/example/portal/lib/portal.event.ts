import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs/bus/event.bus'
import { UserCommand, UserQuery } from '../../user'

export type PortalEvent = {
  $type: 'Portal.FinishedJob'
}

@Injectable()
export class PortalEventListener {
  constructor(
    private eventBus: EventBus<PortalEvent>,
    private userQuery: UserQuery,
    private userCommand: UserCommand,
  ) {}

  async onModuleInit() {
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
