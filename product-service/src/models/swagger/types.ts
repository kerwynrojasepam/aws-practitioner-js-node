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

export const GetProductsListSchema = {
  type: 'array',
  items: [Product],
} as const;

export const CreateProductPayload = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    count: { type: 'number' },
    price: { type: 'number' },
    description: { type: 'string' },
  },
  required: ['title', 'count', 'price', 'description'],
} as const;
