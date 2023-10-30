import axios from 'axios';
import { ChangeEvent, FC, useState } from 'react';

import { vi, it, describe, expect } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { asyncDebounce, wait, waitForRealTimer } from './utils';

describe('Input with async debounce', () => {
  const fetchData = asyncDebounce(
    async (callback: (data: { userId: number }) => void) => {
      const { data } = await axios.get<{ userId: number }>(
        'https://jsonplaceholder.typicode.com/todos/1',
      ); // unknown time

      callback(data);
    },
    1_000,
  );

  const Input: FC = () => {
    const [value, setValue] = useState('');
    const [result, setResult] = useState<{ userId: null | number }>({
      userId: null,
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setValue(e.target.value);
      void fetchData((data) => {
        setResult(data);
      });
    };

    return (
      <>
        <label htmlFor='name'>Name:</label>
        <input id='name' value={value} onChange={handleChange} />
        <dialog open={!!result.userId}>{result.userId}</dialog>
      </>
    );
  };

  it('[Bad] wait', async () => {
    render(<Input />);

    const input = screen.getByLabelText('Name:');

    // eslint-disable-next-line testing-library/await-async-events
    void userEvent.type(input, 'Hello', { delay: 100 });

    await act(async () => {
      await wait(1_000);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await act(async () => {
      await wait(2_000);
    });

    expect(input).toHaveValue('Hello');
    expect(screen.getByRole('dialog')).toHaveTextContent('1');
  });

  it('[Good] runAllTimersAsync', async () => {
    vi.useFakeTimers();
    render(<Input />);

    const input = screen.getByLabelText('Name:');

    // eslint-disable-next-line testing-library/await-async-events
    void userEvent.type(input, 'Hello', {
      delay: 100,
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });

    await vi.advanceTimersByTimeAsync(1_000);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await vi.runAllTimersAsync();

    await waitForRealTimer(() =>
      expect(screen.queryByRole('dialog')).toHaveTextContent('1'),
    );
    expect(input).toHaveValue('Hello');

    vi.useRealTimers();
  });
});
