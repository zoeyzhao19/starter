import type { UseFetchOptions } from '@vueuse/core';
import { createFetch } from '@vueuse/core';
import { unref } from 'vue';

interface UseRequestInit extends RequestInit {
  prefix?: string;
}

const API_PREFIX = '/';

function parseParamsToString(params: Record<string, any>) {
  try {
    return params
      ? Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join('&')
      : '';
  } catch (err) {
    console.error(err);
    return '';
  }
}

function normalizeUrl(url: string, params?: Record<string, any>) {
  if (params) {
    const parsedString = parseParamsToString(params);
    return url.includes('?') ? `${url}&${parsedString}` : `${url}?${parsedString}`;
  }
  return url;
}

const useRawFetch = createFetch({
  baseUrl: `${API_PREFIX}`,
  combination: 'overwrite',
  options: {
    async beforeFetch(ctx) {
      const options = ctx.options as UseRequestInit;
      if (options.prefix) ctx.url = ctx.url.replace(API_PREFIX, options.prefix);
      // options.headers = {
      //   ...options.headers
      //   Authorization: `Bearer xx`,
      // }
      return ctx;
    },
    async afterFetch(ctx) {
      return ctx;
    },
    onFetchError(ctx) {
      // ctx.error.message
      return ctx;
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
});

export function useFetch() {
  async function get<T>(
    url: string,
    params?: Record<string, any>,
    requestInit: UseRequestInit = {},
    options: UseFetchOptions = {},
  ) {
    const { data } = await useRawFetch<T>(normalizeUrl(url, params), requestInit, options).get().json<T>();
    return unref(data);
  }

  async function post<T>(
    url: string,
    params?: Record<string, any>,
    requestInit: UseRequestInit = {},
    options: UseFetchOptions = {},
  ) {
    const { data } = await useRawFetch<T>(url, requestInit, options).post(params).json<T>();
    return unref(data);
  }

  return {
    get,
    post,
  };
}
