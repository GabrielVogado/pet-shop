# SonarQube Cloud — análise de qualidade e cobertura

> Revisão 13/11/2026. Complementa o [MANUAL §4](MANUAL.md#4-cicd).

## Como funciona

O `ci.yml` roda a análise no fim de cada área, **só se o secret `SONAR_TOKEN` existir** (sem ele o passo é pulado e o CI não reprova; PR de fork também não recebe secrets).

| Área | Projeto no Sonar (chave) | Cobertura | Onde se configura |
|---|---|---|---|
| Backend (Quarkus) | `gabrielvogado_pet-shop-backend` | JaCoCo (`target/site/jacoco/jacoco.xml`), gerado no `mvn verify` | propriedades `sonar.*` no `pet-shop-backend/pom.xml` |
| Frontend (React + Vite) | `gabrielvogado_pet-shop-frontend` | Vitest com `v8` → `coverage/lcov.info` | `pet-shop-frontend/sonar-project.properties` |

Decisão: **dois projetos**, um por área, para cada um ter o seu quality gate e a sua cobertura (um projeto único misturaria Java e JS num só percentual).

A análise do backend só roda se o `mvn verify` passar; a do frontend roda mesmo com teste vermelho (a cobertura sai assim mesmo).

## O que o PO precisa fazer (uma vez)

1. Entrar em [sonarcloud.io](https://sonarcloud.io) com a conta do GitHub e, se ainda não existir, criar/importar a organização `gabrielvogado`.
2. *Analyze new project* → escolher o repositório `pet-shop` e criar **dois projetos** com exatamente estas chaves (*Project key*):
   - `gabrielvogado_pet-shop-backend`
   - `gabrielvogado_pet-shop-frontend`
   Se o painel sugerir outra organização ou chave, avise: o `pom.xml` e o `sonar-project.properties` precisam ser ajustados para o mesmo valor.
3. Em *Administration → Analysis Method* de cada projeto, **desligar a Automatic Analysis** (senão ela conflita com a análise do CI).
4. Em *My Account → Security*, gerar um token (tipo *User* ou *Project Analysis*) e copiar.
5. No GitHub: *Settings → Secrets and variables → Actions → New repository secret*, nome `SONAR_TOKEN`, colar o token. **Nunca** colar o token no chat nem em arquivo do repositório.
6. Abrir um PR qualquer que mude backend e frontend (ou reexecutar o CI) e conferir os dois projetos no painel.
7. Opcional, depois da primeira análise verde: adicionar o *Quality Gate* como check obrigatório nos rulesets.

## Limites conhecidos

- Cobertura hoje é baixa (débito DT-09); o quality gate padrão (*Sonar way*) só cobra 80% no **código novo**.
- Sem cobertura de integração: o backend só tem testes unitários (sem `@QuarkusTest`).
