# Visão do Produto

> Estado medido no código da branch `develop` em 05/11/2026.

## Problema

Donos de pets precisam agendar banho e vacina sem depender de telefone ou WhatsApp, e o petshop precisa de uma agenda organizada, sem conflito de horário, com os dados do tutor e do pet à mão.

## Perfis

| Perfil | Papel no sistema (`role`) | O que faz |
|---|---|---|
| Tutor | `tutor` | Cria conta com telefone e endereço, cadastra pets, consulta horários livres, agenda e cancela serviços, recebe notificações |
| Dono do petshop | `owner` | Cadastra a loja, mantém o catálogo de serviços, vê a agenda com dados completos de tutor e pet, cancela agendamentos |

## O que o MVP entrega hoje

- Cadastro e login com JWT RS256, senha em BCrypt e limite de 5 tentativas de login por minuto.
- Cadastro de pets (vários por tutor), com edição e consulta individual.
- Catálogo de serviços por petshop em duas categorias (banho e vacina), com atualização em tempo real via SSE.
- Agendamento com cálculo de disponibilidade para os próximos 14 dias, entre 9h e 18h, em passos de 30 minutos, sem sobreposição.
- Cancelamento pelo tutor ou pelo petshop; quando o petshop cancela, o tutor recebe uma notificação.
- Histórico de serviços por pet e carteira de vacinação no app do tutor.
- Dashboard do owner com a agenda da loja.

## Limitações atuais

- **Um único petshop**: o cadastro de owner é bloqueado quando já existe um, e todo owner recebe o mesmo `petshopId` fixo (`petshop-unico`).
- **Sem pagamento**: o preço do serviço é só informativo.
- **Somente web**: não há app mobile.
- **Status "Concluído" nunca é atribuído**: não existe fluxo para marcar um serviço como realizado.

O plano para sair dessas limitações está no [Roadmap](Roadmap.md).
