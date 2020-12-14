import { Injectable } from '@nestjs/common'
import { EventBus } from '../../../core/cqrs'

export type UserEvent =
  | {
      $type: 'User.LoggedIn'
      id: string
    }
  | {
      $type: 'User.Registered'
      id: string
    }

@Injectable()
export class UserEventListener {
  constructor(private eventBus: EventBus<UserEvent>) {}

  async onModuleInit() {
    this.eventBus.subscribe(async () => {})
  }
}
