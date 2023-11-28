export enum ROLE_LIST {
  ADMIN = 1,
  OPERATOR = 2,
  COLLECTOR = 3,
  SHIPPER = 4,
  CUSTOMER = 5,
}

export enum STATION_TYPE {
  WARD,
  DISTRICT,
  CITY,
}

export enum ORDER_STATUS {
  ORDER_CREATED,
  WAITING_COLLECTOR_CONFIRM,
  WAITING_CUSTOMER_BRING_TO_STATION,
  COLLECTOR_ON_THE_WAY_TO_STATION,
  ORDER_READY_TO_SHIP,
  ORDER_ON_THE_WAY_TO_RECEIVER,
  ORDER_HAS_BEEN_SHIPPED,
  WAITING_COLLECTOR_TO_TRANSIT,
}

export class commonUpdateDto {
  id: number;
}

export interface KeyValue {
  [key: string]: any;
}

export const GENERAL_CONFIG = {
  baseRate: 10000,
  weightLevel: 3000,
  city: 5000,
  differentCity: 10000,
};

export enum MANIFEST_TYPE {
  PICKUP,
  DROP,
}

export const MAX_ATTEMP_PICKUP = 3;
export const MAX_ATTEMP_DROP = 3;
export const STATION_CONNECTED_PATH_KEY = 'stationConnectedPath';
