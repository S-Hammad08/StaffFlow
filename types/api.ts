export type ApiResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};
