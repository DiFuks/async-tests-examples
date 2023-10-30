import axios from 'axios';

import { vi, it, describe, expect } from 'vitest';

import { asyncDebounce, wait, waitForRealTimer } from './utils';

describe('Async debounce', () => {
  const fetchData = asyncDebounce(
    async (callback: (data: { userId: number }) => void) => {
      const { data } = await axios.get<{ userId: number }>(
        'https://jsonplaceholder.typicode.com/todos/1',
      ); // unknown time

      callback(data);
    },
    1_000,
  );

  it('[Bad] wait', async () => {
    const callback = vi.fn();

    void fetchData(callback);
    void fetchData(callback);
    void fetchData(callback);

    await wait(1_000 + 1_000);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 }),
    );
  });

  it('[Good] advanceTimersByTimeAsync and runAllTimersAsync', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    void fetchData(callback);
    void fetchData(callback);
    void fetchData(callback);
    await vi.runAllTimersAsync();

    await waitForRealTimer(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 }),
    );

    vi.useRealTimers();
  });
});
