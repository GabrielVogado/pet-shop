import { AuthScreen } from '../../features/auth/ui/AuthScreen';
import { useAuth } from '../../shared/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const { login, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (token, user) => {
    login(token, user);
    navigate(isOwner ? '/owner' : '/tutor');
  };

  const handleRegister = () => {
    // After register, switch to login mode
  };

  return <AuthScreen onRegister={handleRegister} onLogin={handleLogin} />;
}
