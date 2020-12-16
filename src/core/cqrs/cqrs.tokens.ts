export const CqrsTokens = {
  QueryBusOptions: Symbol('Query Bus Options'),
  CommandBusOptions: Symbol('Query Bus Options'),
  EventBusOptions: Symbol('Query Bus Options'),
  QueueOptions: Symbol('Queue Options'),
  Queue: Symbol('Queue'),
}

export enum CqrsBusType {
  Command = 'Command',
  Query = 'Query',
  Event = 'Event',
}
