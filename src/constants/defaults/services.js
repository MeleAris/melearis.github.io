import { services } from '../content';

export const DEFAULT_SERVICES = services.map((service, index) => ({
  ...service,
  order: index,
}));
