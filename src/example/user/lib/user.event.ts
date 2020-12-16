import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs'

export type UserEvent =
  | {
      __type: 'User.LoggedIn'
      id: string
    }
  | {
      __type: 'User.Registered'
      id: string
    }

@Injectable()
export class UserEventListener {
  constructor(private eventBus: EventBus<UserEvent>) {}

  async onModuleInit() {
    this.eventBus.subscribe(async () => {})
  }
}
