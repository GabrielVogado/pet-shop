import { AuthScreen } from '../../features/auth/ui/AuthScreen';
import { useAuth } from '../../shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../features/auth/api/authApi';

export function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      login(data.token, data.user);
      const loginIsOwner = data.user?.role === 'owner' || data.user?.groups?.includes('owner');
      navigate(loginIsOwner ? '/owner' : '/tutor');
      return { ok: true, message: '' };
    } catch (error) {
      return { ok: false, message: error.message || 'Falha ao fazer login.' };
    }
  };

  const handleRegister = async (payload) => {
    try {
      await authApi.register(payload);
      return { ok: true, message: 'Conta criada com sucesso! Faca login para continuar.' };
    } catch (error) {
      return { ok: false, message: error.message || 'Falha ao criar conta.' };
    }
  };

  return <AuthScreen onRegister={handleRegister} onLogin={handleLogin} />;
}
