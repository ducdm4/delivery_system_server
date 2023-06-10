export interface SearchInterface {
  keyword: string;
  sort: Array<{ [key: string]: string | number }>;
  page: number;
  limit: number;
  filter?: Array<{ [key: string]: string | number }>;
}
