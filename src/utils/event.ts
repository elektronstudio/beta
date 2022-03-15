// TODO: Bring processEvent here from ./strapi.ts

export type Event = {
  title: string;
  formattedFromDatetime: string;
  formattedDistance: string;
  ticketUrl: string;
  route: string;
  // TODO: add other fields
  [key: string]: any;
};
