export interface ProductFilterType {
  color?: string | string[] | undefined;
  brand?: string[] | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  page: number;
}
