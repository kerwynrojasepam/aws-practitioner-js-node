import { Product } from '../models/models.types';

export type CreateProductPayload = Omit<Product, 'id'>;
