import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
console.log('Server is listening for requests');
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
