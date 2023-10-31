import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, beforeAll, vi } from 'vitest';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any
  interface Assertion<T = any>
    extends jest.Matchers<void, T>,
      matchers.TestingLibraryMatchers<T, void> {}
}

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  // https://github.com/testing-library/react-testing-library/issues/1197
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.jest = vi;
});
