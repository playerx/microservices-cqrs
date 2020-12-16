import { Injectable } from '@nestjs/common'
import { QueryHandler } from '../../../core/cqrs/decorators/queryHandler.decorator'
import { UserQueryCqrs } from '../shared/user.query.shared'
import { UserRepo } from './user.repo'
@QueryHandler({ publicApi: UserQueryCqrs })
@Injectable()
export class UserQuery implements UserQueryCqrs {
  constructor(public repo: UserRepo) {}

  async byId(props: { id: string }) {
    const { id } = props

    return this.repo.data.find(x => x.id === id) ?? null
  }

  async list(props: {}) {
    return this.repo.data
  }
}
