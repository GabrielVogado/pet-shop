import { AuthScreen } from '../../../widgets/auth-screen/ui/AuthScreen';

export function AuthPage({ onRegister, onLogin }) {
  return <AuthScreen onRegister={onRegister} onLogin={onLogin} />;
}
