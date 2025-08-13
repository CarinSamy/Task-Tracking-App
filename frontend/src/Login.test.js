import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Pages/Login.jsx'; // adjust path if needed
import { server } from './mocks/server';
import { rest } from 'msw';

it('shows success message when login is correct', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');

  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Login successful')).toBeInTheDocument();
  });
});

it('shows error message when login is wrong', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await userEvent.type(
    screen.getByPlaceholderText(/enter your email/i),
    'wrong@example.com'
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your password/i),
    'wrongpass'
  );

  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(async () => {
    expect(await screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
