import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthPage } from './AuthPage';

const { loginMock, navigateMock, loginApiMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  navigateMock: vi.fn(),
  loginApiMock: vi.fn()
}));

vi.mock('../../shared/hooks/useAuth', () => ({
  useAuth: () => ({ login: loginMock })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

vi.mock('../../features/auth/api/authApi', () => ({
  authApi: {
    login: loginApiMock,
    register: vi.fn()
  }
}));

vi.mock('../../features/auth/ui/AuthScreen', () => ({
  AuthScreen: ({ onLogin }) => (
    <button type="button" onClick={() => onLogin({ email: 'owner@example.com', password: '123456' })}>
      Entrar
    </button>
  )
}));

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona owner para /owner após login', async () => {
    const user = userEvent.setup();
    loginApiMock.mockResolvedValue({
      token: 'owner-token',
      user: { id: 'owner-1', role: 'owner' }
    });

    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(loginMock).toHaveBeenCalledWith('owner-token', { id: 'owner-1', role: 'owner' });
    expect(navigateMock).toHaveBeenCalledWith('/owner');
  });

  it('redireciona tutor para /tutor após login', async () => {
    const user = userEvent.setup();
    loginApiMock.mockResolvedValue({
      token: 'tutor-token',
      user: { id: 'user-1', role: 'tutor' }
    });

    render(<AuthPage />);
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(loginMock).toHaveBeenCalledWith('tutor-token', { id: 'user-1', role: 'tutor' });
    expect(navigateMock).toHaveBeenCalledWith('/tutor');
  });
});
