import { debounce } from 'lodash';

import { vi, it, describe, expect } from 'vitest';

import { wait } from './utils';

describe('Debounce', () => {
  const debouncedFn = debounce((callback: () => void) => {
    callback();
  }, 1_000);

  it('[Bad] wait', async () => {
    const callback = vi.fn();

    debouncedFn(callback);
    await wait(500);
    debouncedFn(callback);
    await wait(500);
    debouncedFn(callback);
    await wait(1_500);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('[Good] advanceTimersByTime', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    debouncedFn(callback);
    vi.advanceTimersByTime(500);
    debouncedFn(callback);
    vi.advanceTimersByTime(500);
    debouncedFn(callback);
    vi.advanceTimersByTime(2_000);

    expect(callback).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('[Good] runAllTimers', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    debouncedFn(callback);
    debouncedFn(callback);
    debouncedFn(callback);

    vi.runAllTimers(); // нам даже не нужно знать, какой дебаунс тут используется

    expect(callback).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
