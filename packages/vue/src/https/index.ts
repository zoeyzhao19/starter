import { useFetch } from '../composables';

const { get, post } = useFetch();

interface ApiResult<T> {
  data: T;
}

interface ResponseData {}

export async function getXXX(params: Record<string, any>) {
  return await get<ApiResult<ResponseData>>('xxx', params);
}

export async function postXXX(params?: Record<string, any>) {
  return await post<ApiResult<ResponseData>>('xxx', params);
}
