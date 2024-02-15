import { FC, useState } from 'react';

import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { wait } from './utils';

describe('Button with timeout', () => {
  const Button: FC<{ timeout?: number; onHover?: () => void }> = ({
    timeout,
    onHover,
  }) => {
    const [counter, setCounter] = useState(0);

    const handleClick = (): void => {
      if (timeout !== undefined) {
        setTimeout(() => {
          setCounter((prev) => prev + 1);
        }, timeout);

        return;
      }

      setCounter((prev) => prev + 1);
    };

    return (
      <>
        <button onMouseEnter={onHover} type='button' onClick={handleClick}>
          Click me
        </button>
        <dialog open={true}>{counter}</dialog>
      </>
    );
  };

  it('[Bad] dispatchEvent with wait', async () => {
    render(<Button />);

    const button = screen.getByRole('button', { name: 'Click me' });

    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await wait(10);

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveTextContent('1');
  });

  it('[Good] userEvent', async () => {
    render(<Button />);

    const button = screen.getByRole('button', { name: 'Click me' });

    await userEvent.click(button);

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveTextContent('1');
  });

  it('[Bad] userEvent with wait', async () => {
    render(<Button timeout={1_000} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    const dialog = screen.getByRole('dialog');

    await wait(1_000);

    expect(dialog).toHaveTextContent('3');
  });

  it('[Good] userEvent with fakeTimers', async () => {
    vi.useFakeTimers();

    render(<Button timeout={1_000} />);

    const ue = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

    const button = screen.getByRole('button', { name: 'Click me' });
    const dialog = screen.getByRole('dialog');

    await ue.click(button);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(dialog).toHaveTextContent('1');

    vi.useRealTimers();
  });

  it('[Good] userEvent with fakeTimers and shouldAdvanceTime', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(<Button timeout={1_000} />);

    const ue = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

    const button = screen.getByRole('button', { name: 'Click me' });
    const dialog = screen.getByRole('dialog');

    await ue.click(button);

    await waitFor(
      () => {
        expect(dialog).toHaveTextContent('1');
      },
      {
        timeout: 2_000,
      },
    );

    vi.useRealTimers();
  });

  it('[Bad] hover fireEvent', () => {
    const onHoverMock = vi.fn();

    render(<Button onHover={onHoverMock} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.mouseEnter(button);
    // eslint-disable-next-line testing-library/prefer-user-event
    fireEvent.click(button);

    const dialog = screen.getByRole('dialog');

    expect(onHoverMock).toHaveBeenCalled();
    expect(dialog).toHaveTextContent('1');
  });

  it('[Good] hover userEvent', async () => {
    const onHoverMock = vi.fn();

    render(<Button onHover={onHoverMock} />);

    const button = screen.getByRole('button', { name: 'Click me' });

    await userEvent.click(button);

    const dialog = screen.getByRole('dialog');

    expect(onHoverMock).toHaveBeenCalled();
    expect(dialog).toHaveTextContent('1');
  });
});
