// NOTE(kb): the class can be abstract, but we need an implementation for each method that is publicly exposed
// 		Recommend that we use this to throw a fallback error for each method

export abstract class UserCommandCqrs {
  login(props: {
    username: string
    password: string
  }): Promise<string | null> {
    throw new Error('Method not implemented.')
  }
  register(props: {
    firstName: string
    lastName: string
  }): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
