export const ROUTES = {
  HOME: '/home',
  MY_ORDERS: '/my-orders',
  MY_CREATE_ORDERS: '/my-create-orders',
  MY_PAGE: '/my-page',
  MY_ORDER_EDIT: '/my-orders/:id/edit'
}

export const PAGINATION_PARAMS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 25
}

export enum SHARE_SCOPE {
  PUBLIC = 'public',
  LIMIT = 'limit'
}

export const PAYMENT_METHODS = [
  {
    value: "cash",
    label: "Cash",
  },
  {
    value: "vietcombank",
    label: "Vietcombank",
  },
]