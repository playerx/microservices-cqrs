import { CqrsBusType } from '../cqrs.tokens'

export const COMMAND_HANDLER_METADATA =
  'CQRS COMMAND Handler Metadata'
export const QUERY_HANDLER_METADATA = 'CQRS QUERY Handler Metadata'
export const EVENT_HANDLER_METADATA = 'CQRS EVENT Handler Metadata'

export const HANDLER_ARGS_LENGTH = 'CQRS HANDLER args length'

export const HANDLER_TYPE_METADATA = {
  [CqrsBusType.Command]: COMMAND_HANDLER_METADATA,
  [CqrsBusType.Query]: QUERY_HANDLER_METADATA,
}
