# PetCare Agenda

O PetCare Agenda é uma plataforma que liga **donos de pets (tutores)** a **petshops** para agendar serviços pelo celular ou pelo navegador, sem ligação, sem mensagem solta e sem agenda de papel.

## Para quem é

- **Tutor:** encontra um petshop, escolhe o serviço (banho, tosa, vacina ou consulta), reserva um horário e acompanha tudo pelo app. Usar é grátis.
- **Petshop:** recebe os pedidos de agendamento, aceita ou recusa, organiza a agenda do dia e registra vacinas e serviços feitos. Paga uma mensalidade fixa e pode ter várias filiais.

## O que o sistema faz

- **Agendamento com aceite da loja:** o pedido só vira horário marcado quando o petshop confirma.
- **Sinal de 50%:** o tutor paga metade na reserva. O sinal também funciona como multa: cancelando com menos de 2 horas de antecedência, ou faltando, a loja fica com ele.
- **Pagamento direto para a loja:** cada petshop tem a própria conta recebedora. O PetCare não recebe o dinheiro do serviço.
- **Cartão de vacina digital:** cada registro mostra se foi aplicado por uma loja (verificado) ou informado pelo tutor.
- **Avaliações:** o tutor avalia a loja com estrelas e comentário, e a loja pode responder.
- **Avisos:** notificações no app e pelo WhatsApp para o tutor; app, SMS, WhatsApp e e-mail para a loja.

## Em que pé está

O projeto está na **fase de documentação**: o desenvolvimento só começa depois que o funcionamento do sistema estiver todo descrito. O sistema atual é um protótipo para um único petshop e será refeito do zero para vários petshops, com pagamento e aplicativo Android.

## Onde ler mais

- Como o sistema deve funcionar: [Documento Negocial](Documentos/01-negocio/Documento-Negocial-v2.0.md)
- O que será feito e em que ordem: [Roadmap](Documentos/04-backlog/Roadmap-v1.0.md)
- Decisões técnicas e custos: [ADRs](Documentos/08-analise-tecnica/adrs.md) e [Estimativa de custo de nuvem](Documentos/02-arquitetura-tecnica/Estimativa-Custo-Nuvem-v1.0.md)
- Toda a documentação: [Índice](Documentos/00-INDICE.md)

## Para desenvolvedores

Cada parte do código tem o próprio README com instruções de instalação, execução e testes:

- [`pet-shop-backend/`](pet-shop-backend/README.md): API
- [`pet-shop-frontend/`](pet-shop-frontend/README.md): interface web

O fluxo de branches e de documentação está no [Manual do desenvolvedor](Documentos/10-git-flow/MANUAL.md).
