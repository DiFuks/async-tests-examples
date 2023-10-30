import { describe, vi, it, expect } from 'vitest';

import { wait } from './utils';

describe('Call callback after timeout', () => {
  const callAfterTimeout = (callback: () => void): void => {
    setTimeout(callback, 2_000);
  };

  it('[Bad] wait', async () => {
    const callback = vi.fn();

    callAfterTimeout(callback);

    await wait(1_000);
    expect(callback).not.toHaveBeenCalled();
    await wait(1_000);
    expect(callback).toHaveBeenCalled();
  });

  it('[Good] advanceTimersByTime', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    callAfterTimeout(callback);

    vi.advanceTimersByTime(1_000);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1_000);
    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('[Good] runAllTimers', () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    callAfterTimeout(callback);

    // vi.runAllTimers();
    vi.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
