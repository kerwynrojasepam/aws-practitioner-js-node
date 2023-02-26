import { BaseItem } from '../../types/BaseModel';
import { FromSchema } from 'json-schema-to-ts';

export const Product = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    count: { type: 'number' },
    price: { type: 'number' },
    description: { type: 'string' },
  },
  required: ['id', 'title', 'count', 'price', 'description'],
} as const;

export type ProductType = FromSchema<typeof Product> & BaseItem;

export const GetProductsListSchema = {
  type: 'array',
  items: [Product],
} as const;
