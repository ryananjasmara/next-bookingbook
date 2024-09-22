export type ApiResponse<T> = {
  message: string;
  data: T | null;
  httpCode: number;
};
