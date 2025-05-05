export interface IGetMany<T> {
  page: number;
  data: T[];
  totalCount: number;
}
