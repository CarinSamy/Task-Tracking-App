import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:8081/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    console.log('Login request received:', { email, password });
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          message: 'Login successful',
          token: 'fake-jwt-token',
          user: { id: '1', name: 'user', email: 'test@example.com' },
        })
      );
    }
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),
];
