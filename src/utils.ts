import { debounce } from 'lodash';

import { waitFor, waitForOptions } from '@testing-library/react';
import { vi } from 'vitest';

export const wait = <T>(ms: number): Promise<T> =>
  new Promise<T>((resolve) => {
    setTimeout(resolve, ms);
  });

export const asyncDebounce = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (...args: any[]) => Promise<any>,
  Result = ReturnType<F> extends Promise<infer Res> ? Res : never,
>(
  func: F,
  timeout?: number,
): ((...args: Parameters<F>) => Promise<Result> | undefined) => {
  const debounced = debounce(
    async (
      resolve: (result: Result) => void,
      reject: (error: unknown) => void,
      args: Parameters<F>,
    ) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        resolve(await func(...args));
      } catch (error) {
        reject(error);
      }
    },
    timeout,
  );

  return (...args: Parameters<F>): Promise<Result> =>
    new Promise<Result>((resolve, reject) => {
      void debounced(resolve, reject, args);
    });
};

export const waitForRealTimer = async <T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions,
): Promise<T> => {
  vi.useRealTimers();

  const result = await waitFor(callback, options);

  vi.useFakeTimers();

  return result;
};
