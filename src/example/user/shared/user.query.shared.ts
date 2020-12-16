import { UserDb } from '../lib/models/user.db'

// NOTE(kb): the class can be abstract, but we need an implementation for each method that is publicly exposed
// 		Recommend that we use this to throw a fallback error for each method

export abstract class UserQueryCqrs {
  byId(props: { id: string }): Promise<UserDb | null> {
    throw new Error('Method not implemented.')
  }
  list(props: {}): Promise<UserDb[]> {
    throw new Error('Method not implemented.')
  }
}
