import 'reflect-metadata';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(5000);

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
}); 