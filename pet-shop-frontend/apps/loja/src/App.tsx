import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PaginaEntrar } from '@pertim/ui';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<PaginaEntrar titulo="Entrar no painel da loja" descricao="Use o e-mail e a senha do cadastro da loja." />} />
        <Route path="*" element={<Navigate to="/entrar" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
