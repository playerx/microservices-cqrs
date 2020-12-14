import { UserDb } from './models/user.db'

export class UserRepo {
  data: UserDb[]

  constructor() {
    this.data = []
  }

  onModuleInit() {
    this.data = []
  }
}
