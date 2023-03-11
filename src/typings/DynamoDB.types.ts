import { Product, Stock } from '@models/models.types';

export type ProductDB = Omit<Product, 'count'>;

export type StockDB = Stock;
