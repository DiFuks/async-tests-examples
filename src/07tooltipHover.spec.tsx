import { FC, useState } from 'react';

import { userEvent } from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { vi, it, expect } from 'vitest';

const Component: FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      {isHovered ? <div role='tooltip'>hello</div> : null}
      <button
        onMouseEnter={() => {
          setTimeout(() => {
            setIsHovered(true);
          }, 200);
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            setIsHovered(false);
          }, 200);
        }}
        type='button'
      >
        test-button!
      </button>
    </div>
  );
};

it('Tooltip should be visible on hover', async () => {
  vi.useFakeTimers();

  render(<Component />);

  const button = screen.getByRole('button', {
    name: 'test-button!',
  });

  await userEvent.hover(button, {
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });

  act(() => {
    vi.advanceTimersByTime(200);
  });

  expect(screen.getByRole('tooltip').textContent).toBe('hello');

  await userEvent.unhover(button, {
    advanceTimers: vi.advanceTimersByTime.bind(vi),
  });
  act(() => {
    vi.advanceTimersByTime(200);
  });
  expect(screen.queryByText('hello')).toBeNull();

  vi.useRealTimers();
});
