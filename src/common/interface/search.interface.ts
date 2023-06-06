export interface SearchInterface {
  keyword: string;
  sort: Array<{ [key: string]: string | number }>;
}
