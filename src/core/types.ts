export type Props<T extends (...args: any) => any> = Parameters<T>[0]
