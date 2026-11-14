import { useState, type FormEvent } from 'react';
import { Botao } from './Botao';
import { Campo } from './Campo';

type Credenciais = { email: string; senha: string };
type Erros = Partial<Record<keyof Credenciais, string>>;

function validar({ email, senha }: Credenciais): Erros {
  const erros: Erros = {};
  if (!email) erros.email = 'Informe seu e-mail.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) erros.email = 'Esse e-mail não parece certo. Confira e tente de novo.';
  if (!senha) erros.senha = 'Informe sua senha.';
  return erros;
}

/** Formulário de entrar (T1). Valida e entrega as credenciais; quem chama faz a requisição e, se falhar, lança um Error com a mensagem para a pessoa. */
export function FormularioEntrar({ onEntrar }: { onEntrar: (credenciais: Credenciais) => void | Promise<void> }) {
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState('');

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const credenciais = { email: String(dados.get('email')).trim(), senha: String(dados.get('senha')) };
    const novosErros = validar(credenciais);
    setErros(novosErros);
    setFalha('');
    if (Object.keys(novosErros).length > 0) return;

    setEnviando(true);
    try {
      await onEntrar(credenciais);
    } catch (erro) {
      setFalha(erro instanceof Error ? erro.message : 'Não deu para entrar. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-4">
      <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" erro={erros.email} />
      <Campo rotulo="Senha" name="senha" type="password" autoComplete="current-password" erro={erros.senha} />
      {falha && (
        <p role="alert" className="rounded-lg bg-error-container px-3 py-2 text-body-md text-on-error-container">
          {falha}
        </p>
      )}
      <Botao type="submit" carregando={enviando} className="w-full">
        Entrar
      </Botao>
    </form>
  );
}
