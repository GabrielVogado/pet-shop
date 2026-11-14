import { useState, type FormEvent } from 'react';
import { Botao } from './Botao';
import { Campo } from './Campo';

type Credenciais = { email: string; senha: string };
type Erros = Partial<Record<keyof Credenciais, string>>;

export const OPCAO_EM_BREVE = 'Essa opção chega em breve: o servidor novo está em construção.';

function validar({ email, senha }: Credenciais): Erros {
  const erros: Erros = {};
  if (!email) erros.email = 'Informe seu e-mail.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) erros.email = 'Esse e-mail não parece certo. Confira e tente de novo.';
  if (!senha) erros.senha = 'Informe sua senha.';
  return erros;
}

function Olho({ aberto }: { aberto: boolean }) {
  // Material Icons Outlined "visibility" e "visibility_off" (Apache 2.0).
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      {aberto ? (
        <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
      ) : (
        <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
      )}
    </svg>
  );
}

const estiloLink = 'rounded text-body-lg font-semibold text-primary underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

type Props = {
  onEntrar: (credenciais: Credenciais) => void | Promise<void>;
  /** Esqueci a senha, Google e Criar conta (T11 a T13). Sem a função, a tela avisa que a opção chega em breve. */
  onEsqueciSenha?: () => void;
  onEntrarComGoogle?: () => void;
  onCriarConta?: () => void;
};

/**
 * Formulário de entrar (T1), na disposição do protótipo: e-mail, senha com olho, esqueci a senha,
 * Entrar, "ou", Entrar com Google e Criar conta. Valida e entrega as credenciais; quem chama faz a
 * requisição e, se falhar, lança um Error com a mensagem para a pessoa.
 */
export function FormularioEntrar({ onEntrar, onEsqueciSenha, onEntrarComGoogle, onCriarConta }: Props) {
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const ouAvisar = (acao?: () => void) => () => (acao ? acao() : setFalha(OPCAO_EM_BREVE));

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
    <div className="flex flex-1 flex-col gap-6 sm:flex-none">
      <form onSubmit={enviar} noValidate className="flex flex-col">
        <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" placeholder="voce@email.com" erro={erros.email} />
        <Campo
          rotulo="Senha"
          name="senha"
          type={senhaVisivel ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Sua senha"
          erro={erros.senha}
          className="mt-4"
          acessorio={
            <button
              type="button"
              onClick={() => setSenhaVisivel((v) => !v)}
              aria-label={senhaVisivel ? 'Esconder senha' : 'Mostrar senha'}
              aria-pressed={senhaVisivel}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-on-surface-variant focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Olho aberto={!senhaVisivel} />
            </button>
          }
        />
        <button type="button" onClick={ouAvisar(onEsqueciSenha)} className={`mt-3 self-end ${estiloLink}`}>
          Esqueci a senha
        </button>
        {falha && (
          <p role="alert" className="mt-4 rounded-xl bg-error-container px-3 py-2 text-body-md text-on-error-container">
            {falha}
          </p>
        )}
        <Botao type="submit" carregando={enviando} className="mt-6 w-full">
          Entrar
        </Botao>
      </form>

      <div className="flex items-center gap-3 text-body-md text-on-surface-variant" aria-hidden="true">
        <span className="h-px flex-1 bg-outline-variant" />
        ou
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <Botao variante="secundario" onClick={ouAvisar(onEntrarComGoogle)} className="w-full">
        <span aria-hidden="true" className="font-display text-title-lg font-extrabold">
          G
        </span>
        Entrar com Google
      </Botao>

      <p className="mt-auto pt-6 text-center text-body-lg text-on-surface">
        Ainda não tem conta?{' '}
        <button type="button" onClick={ouAvisar(onCriarConta)} className={estiloLink}>
          Criar conta
        </button>
      </p>
    </div>
  );
}
