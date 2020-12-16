import { Abstract, Type } from '@nestjs/common'

export type Props<T extends (...args: any) => any> = Parameters<T>[0]

export type ICqrsService = Type<any> | Abstract<any>
