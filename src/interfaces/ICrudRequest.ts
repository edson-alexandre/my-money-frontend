export interface ICrudRequest<T> {
  list?(): Promise<T[]>;
  listById?(id: string | number): Promise<T>;
  create?(resource: T): Promise<T>;
  update?(id: string | number, resource: T): Promise<T>;
  remove?(id: string | number, resource: T): Promise<void>;
}
