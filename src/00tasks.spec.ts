import { vi, it, expect } from 'vitest';

it('execution order', async () => {
  vi.useFakeTimers();
  const order = [];
  order.push('1');
  setTimeout(() => { order.push('6'); }, 0);
  const promise = new Promise<void>(resolve => {
    order.push('2');
    resolve();
  }).then(() => {
    order.push('4');
  });
  order.push('3');
  await promise;
  order.push('5');
  vi.advanceTimersByTime(0);
  expect(order).toEqual([ '1', '2', '3', '4', '5', '6' ]);
});
