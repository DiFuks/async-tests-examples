import { vi, it, describe, expect } from 'vitest';

import { wait } from './utils';

describe('Call callback after timeout async', () => {
  const callAfterTimeoutAsync = async (callback: () => void): Promise<void> => {
    await wait(2_000);

    callback();
  };

  it('[Bad] wait', async () => {
    const callback = vi.fn();

    void callAfterTimeoutAsync(callback);

    await wait(1_000);
    expect(callback).not.toHaveBeenCalled();
    await wait(1_000);
    expect(callback).toHaveBeenCalled();
  });

  it('[Bad] Promise.resolve()', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    void callAfterTimeoutAsync(callback);

    vi.advanceTimersByTime(1_000);
    await Promise.resolve();
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    await Promise.resolve();
    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('[Good] advanceTimersByTime', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    void callAfterTimeoutAsync(callback);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(callback).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('[Good] runAllTimersAsync', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    void callAfterTimeoutAsync(callback);

    await vi.runAllTimersAsync();
    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
