export interface IFindMany<T> {
	page: number;
	data: T[];
	totalCount: number;
}
