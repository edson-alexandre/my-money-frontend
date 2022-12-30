export interface IPaginationReturn<T> {
  perPage: number;
  page: number;
  total: number;
  data: T;
}
