import { SearchInterface } from '../interface/search.interface';
import { encode } from 'html-entities';

export const generatePasswordString = () => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'[
    Math.floor(Math.random() * 26)
  ];
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[
    Math.floor(Math.random() * 26)
  ];
  const special = ')!@#$%^&*('[Math.floor(Math.random() * 10)];
  return `${lowerCase}${upperCase}${special}${Math.floor(
    Math.random() * 1000,
  )}`;
};

export const getFilterObject = (req) => {
  const filterObject: SearchInterface = {
    keyword: '',
    sort: [],
    filter: [],
    page: 0,
    limit: 10,
  };
  if (typeof req.query['keyword'] === 'string') {
    filterObject.keyword = encode(req.query['keyword']);
  }
  if (typeof req.query['sort'] === 'object') {
    for (const [key, value] of Object.entries(req.query['sort'])) {
      filterObject.sort.push({
        key,
        value: value as string,
      });
    }
  }
  if (typeof req.query['filter'] === 'object') {
    for (const [key, value] of Object.entries(req.query['filter'])) {
      filterObject.filter.push({
        key,
        value: value as string,
      });
    }
  }
  if (typeof req.query['page'] === 'string') {
    filterObject.page = parseInt(req.query['page']);
  }
  if (typeof req.query['limit'] === 'string') {
    filterObject.limit = parseInt(req.query['limit']);
  }

  return filterObject;
};
