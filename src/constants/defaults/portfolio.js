import { works } from '../content';

export const DEFAULT_WORKS = works.map((work, index) => ({
  ...work,
  order: index,
}));
