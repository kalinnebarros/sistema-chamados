Sistema de Atendimento — Clínica Uninassau
Aplicação web desenvolvida em React + Vite para simular e gerenciar um fluxo de atendimento por senhas. O sistema possui emissão de senhas, terminal do atendente, painel de chamadas, histórico, dashboard e navegação entre as telas.
Este README descreve o estado atual do projeto contido no repositório.

Visão geral
O fluxo principal da aplicação é:
Cliente escolhe o atendimento
        ↓
Emissão gera uma senha
        ↓
Senha entra como AGUARDANDO
        ↓
Atendente chama a próxima senha
        ↓
Painel exibe a chamada
        ↓
Atendimento é iniciado
        ↓
Atendimento é finalizado ou marcado como não compareceu
        ↓
Histórico e Dashboard permitem consultar os registros
Os módulos compartilham os dados pela chave senhas do localStorage do navegador.
Tecnologias utilizadas
- React 19 — construção da interface por componentes
- React DOM — renderização da aplicação no navegador
- React Router DOM — rotas e navegação SPA
- Vite 8 — ambiente de desenvolvimento e build
- Recharts — gráficos do Dashboard
- JavaScript / JSX — lógica e componentes
- CSS — estilos e responsividade
- localStorage — persistência local dos registros
- Web Audio API — bip do painel quando uma chamada é detectada
Funcionalidades atuais
Módulo	Situação	Funcionalidades principais
Home	Funcional	Entrada do sistema e acesso rápido para Cliente e Atendente
Menu de navegação	Funcional	Menu lateral/hambúrguer para todas as rotas
Emissão	Funcional	Seleção do tipo de atendimento e geração de senha
Guichê	Funcional	Fila, chamada, segunda chamada, início, finalização e não comparecimento
Painel	Funcional	Senha atual, guichê, últimas chamadas, animação e bip
Histórico	Funcional	Busca, filtros, tabela e acesso ao Dashboard
Dashboard	Funcional	Indicadores, médias e gráficos por tipo de fila


Rotas
As rotas são configuradas em src/App.jsx usando React Router.
Rota	Componente	Finalidade
/	Home	Tela inicial
/emissao	Emissao	Emissão de novas senhas
/guiche	Guiche	Terminal do atendente
/historico	Historico	Histórico e acesso ao Dashboard
/painel	Painel	Painel de chamadas


A aplicação é uma SPA (Single Page Application): o React Router troca os componentes exibidos sem a necessidade de um arquivo HTML diferente para cada tela.
Estrutura do projeto
sistema-chamados-main/
├── src/
│   ├── components/
│   │   ├── botao.jsx
│   │   ├── MenuNavegacao.jsx
│   │   ├── ModalDashboard.jsx
│   │   ├── GraficoBarra.jsx
│   │   └── GraficoRosca.jsx
│   │
│   ├── data/
│   │   └── dados.json
│   │
│   ├── pages/
│   │   ├── home.jsx
│   │   ├── emissao.jsx
│   │   ├── guiche.jsx
│   │   ├── painel.jsx
│   │   └── historico.jsx
│   │
│   ├── services/
│   │   └── senhas.js
│   │
│   ├── styles/
│   │   ├── home.css
│   │   ├── emissao.css
│   │   ├── guiche.css
│   │   ├── painel.css
│   │   ├── historico.css
│   │   ├── MenuNavegacao.css
│   │   ├── ModalDashboard.css
│   │   └── Graficos.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
Existe também src/styles/historicoIntegrado.css no projeto atual, porém o historico.jsx vigente importa src/styles/historico.css.

Modelo de dados de uma senha
Os módulos trabalham com objetos no seguinte formato:
{
  id: "260930-SG005",
  numero: "SG005",
  tipo: "SG",
  estado: "AGUARDANDO",
  guiche: null,
  dataCriacao: "2026-09-30T18:30:00.000Z",
  dataChamada: null,
  dataFinalizacao: null,
  tentativasChamada: 0
}
Campos
Campo	Descrição
id	Identificador formado pela data + número da senha
numero	Senha exibida ao usuário, como SG005
tipo	Categoria: SG, SP ou SE
estado	Situação atual do atendimento
guiche	Guichê responsável pelo atendimento
dataCriacao	Data/hora em que a senha foi emitida
dataChamada	Data/hora da chamada mais recente
dataFinalizacao	Data/hora de encerramento
tentativasChamada	Número de tentativas de chamada


Tipos de atendimento
Sigla	Tipo
SG	Atendimento Geral
SP	Atendimento Prioritário
SE	Atendimento Exame


A tela de emissão converte o atendimento selecionado para uma dessas siglas antes de chamar o serviço de geração de senha.
Estados do atendimento
O projeto trabalha com os seguintes estados:
Estado	Significado
AGUARDANDO	Senha está na fila
CHAMADA	Primeira chamada realizada
CHAMADA_NOVAMENTE	Segunda chamada realizada
EM_ATENDIMENTO	Atendimento iniciado
ATENDIDA	Atendimento finalizado
NAO_COMPARECEU	Cliente não compareceu após as chamadas
EMITIDA	Previsto no filtro do Histórico, embora a emissão atual crie diretamente como AGUARDANDO


Fluxo implementado no Guichê
AGUARDANDO
    ↓ chamar próxima
CHAMADA
    ├──→ iniciar atendimento → EM_ATENDIMENTO → finalizar → ATENDIDA
    └──→ chamar novamente → CHAMADA_NOVAMENTE
                              ├──→ iniciar atendimento → EM_ATENDIMENTO
                              └──→ não compareceu → NAO_COMPARECEU
Persistência com localStorage
O projeto usa:
localStorage["senhas"]
para compartilhar e persistir os atendimentos no mesmo navegador.
Inicialização
No App.jsx, ao iniciar a aplicação, é verificado se a chave senhas já existe:
- se existir, os dados atuais são preservados;
- se não existir, a aplicação copia os registros de src/data/dados.json para o localStorage.
O serviço src/services/senhas.js também possui essa lógica como fallback ao carregar as senhas.
JSON
O localStorage armazena texto. Por isso são usados:
JSON.stringify(lista)
para salvar e:
JSON.parse(texto)
para recuperar os objetos.
Como os dados ficam no navegador, esta persistência é adequada para o protótipo, mas não substitui um banco de dados em um ambiente real com vários computadores.

Home
Arquivo: src/pages/home.jsx
A Home apresenta a entrada da Clínica Uninassau e dois acessos principais:
- Cliente → /emissao
- Atendente → /guiche
Os botões reutilizam o componente src/components/botao.jsx.
Menu de navegação
Arquivo: src/components/MenuNavegacao.jsx
O menu é renderizado globalmente no App.jsx e utiliza Link do React Router.
Possui acesso para:
- Início
- Emissão de Senhas
- Painel (TV)
- Guichê de Atendimento
- Histórico / Dashboard
O menu usa useState para controlar a abertura e o fechamento da navegação lateral.
Emissão de senhas
Arquivo: src/pages/emissao.jsx
A tela permite escolher:
- Atendimento Geral
- Atendimento Prioritário
- Atendimento Exame
Depois de selecionar uma opção, o botão Emitir Senha chama:
gerarSenha(tipo)
em src/services/senhas.js.
Se nenhum tipo tiver sido selecionado, a tela exibe um alerta e não gera a senha.
O botão Reiniciar limpa a seleção e a senha mostrada na tela.
Serviço de senhas
Arquivo: src/services/senhas.js
O serviço possui duas responsabilidades principais.
CarregarSenha()
Recupera o Array salvo em localStorage["senhas"] ou utiliza dados.json caso a chave ainda não exista.
gerarSenha(tipo)
A função:
1. carrega as senhas existentes;
2. filtra somente as senhas do tipo solicitado;
3. extrai a parte numérica de cada senha;
4. encontra o maior número existente;
5. incrementa esse número;
6. adiciona zeros à esquerda com padStart(3, "0");
7. cria um ID baseado na data atual e no número da senha;
8. cria o objeto do atendimento com estado AGUARDANDO;
9. adiciona o objeto ao Array;
10. salva novamente no localStorage;
11. retorna a nova senha para a tela de emissão.
Guichê de atendimento
Arquivo: src/pages/guiche.jsx
O Guichê representa o terminal do atendente e trabalha diretamente com localStorage["senhas"].
Fila de espera
São consideradas na fila as senhas cujo estado é:
AGUARDANDO
Antes de chamar, a fila é ordenada por dataCriacao, portanto a implementação atual chama primeiro a senha aguardando há mais tempo.
Chamar próxima
Ao chamar uma senha:
- estado → CHAMADA;
- guichê → Guichê 01;
- dataChamada → horário atual;
- tentativasChamada → 1.
Segunda chamada
Ao clicar em Chamar novamente:
- estado → CHAMADA_NOVAMENTE;
- dataChamada é atualizada;
- tentativasChamada → 2.
Iniciar atendimento
Altera o estado para:
EM_ATENDIMENTO
Finalizar atendimento
Altera:
- estado → ATENDIDA;
- dataFinalizacao → horário atual.
Não compareceu
Após a segunda chamada, o atendente pode marcar:
- estado → NAO_COMPARECEU;
- dataFinalizacao → horário atual;
- tentativasChamada → 2.
O Guichê atual trabalha com o identificador fixo Guichê 01 ao chamar a próxima senha.

Painel de chamadas
Arquivo: src/pages/painel.jsx
O Painel foi desenvolvido para exibição em uma TV ou monitor de espera.
Ele apresenta:
- senha mais recente;
- tipo da senha;
- guichê;
- aviso de segunda chamada;
- últimas cinco chamadas anteriores.
Atualização
O painel consulta o localStorage:
- ao abrir a página;
- quando recebe um evento storage;
- a cada 1,5 segundo por meio de setInterval.
São consideradas pelo Painel as senhas nos estados:
CHAMADA
CHAMADA_NOVAMENTE
EM_ATENDIMENTO
ATENDIDA
As chamadas são ordenadas pela dataChamada, da mais recente para a mais antiga.
Bip e animação
Quando o painel detecta uma nova senha ou mudança relevante no estado da senha atual:
- toca um bip utilizando a Web Audio API;
- ativa uma animação visual temporária.
Histórico de atendimentos
Arquivo: src/pages/historico.jsx
O Histórico lê diretamente:
localStorage.getItem("senhas")
quando o componente é criado.
Colunas exibidas
- Senha
- Tipo
- Estado
- Guichê
- Data
- Emissão
- Chamada
- Finalização
Datas e horários são formatados com toLocaleDateString("pt-BR") e toLocaleTimeString("pt-BR").
Estados contendo _ são apresentados com espaços, e NAO_COMPARECEU aparece como NÃO COMPARECEU.
Filtros
A tela possui:
- busca por senha ou guichê;
- tipo (SG, SP, SE);
- estado;
- data inicial;
- data final;
- botão para limpar os filtros.
Os filtros são aplicados com Array.filter() e os resultados são renderizados com Array.map().
Observação sobre datas
Na implementação atual, os campos de data usam comparação por igualdade de data, e não um intervalo completo entre início e fim. Esse comportamento pode ser refinado futuramente caso o objetivo seja filtrar todo um período.
Atualização dos dados
O Histórico carrega os atendimentos ao criar o componente. Se os dados forem alterados enquanto a página já estiver aberta, pode ser necessário atualizar ou entrar novamente na rota para recarregar a lista.
Dashboard
Arquivo principal: src/components/ModalDashboard.jsx
O Dashboard é aberto pela página de Histórico e lê os dados de localStorage["senhas"].
É possível filtrar os indicadores por:
- Todos os tipos
- Preferencial (SP)
- Exames (SE)
- Geral (SG)
Indicadores
O Dashboard calcula:
- Total
- Aguardando
- Em Atendimento
- Finalizados
- Desistências
- Espera média
- Atendimento médio
Para o card Em Atendimento, são considerados:
CHAMADA
CHAMADA_NOVAMENTE
EM_ATENDIMENTO
Para Finalizados:
ATENDIDA
Para Desistências:
NAO_COMPARECEU
Tempo médio de espera
É calculado usando:
dataChamada - dataCriacao
para senhas que possuem os dois horários.
Tempo médio de atendimento
É calculado usando:
dataFinalizacao - dataChamada
para senhas finalizadas com estado ATENDIDA.
Os valores são convertidos de milissegundos para minutos dividindo por 60000.
Gráficos
O projeto utiliza Recharts.
Gráfico de rosca
Arquivo: src/components/GraficoRosca.jsx
Apresenta a distribuição entre:
- Aguardando
- Em Atendimento
- Finalizados
- Desistências
Gráfico de barras
Arquivo: src/components/GraficoBarra.jsx
Apresenta os tempos médios de:
- Espera
- Atendimento
por fila:
- Preferencial
- Exames
- Geral
Massa inicial de dados
Arquivo: src/data/dados.json
O projeto possui uma massa inicial com diferentes estados para facilitar demonstrações e testes.
Ela inclui exemplos de senhas:
- aguardando;
- chamadas;
- chamadas novamente;
- em atendimento;
- atendidas;
- não compareceu.
Na primeira execução, quando localStorage["senhas"] ainda não existe, esses registros são carregados para o navegador.
Portanto, no estado atual do projeto, Histórico e Dashboard também exibem/consideram esses registros iniciais, além das novas senhas emitidas posteriormente.

Como executar
Pré-requisitos
- Node.js
- npm
1. Instalar as dependências
npm install
2. Iniciar o ambiente de desenvolvimento
npm run dev
O Vite exibirá o endereço local, normalmente:
http://localhost:5173/
3. Build de produção
npm run build
4. Visualizar o build
npm run preview
5. Lint
npm run lint
Scripts disponíveis
Comando	Finalidade
npm run dev	Inicia o Vite em desenvolvimento
npm run build	Gera o build de produção
npm run preview	Visualiza o build localmente
npm run lint	Executa o Oxlint


Fluxo sugerido para demonstração
1. Abra a Home.
2. Entre em Emissão de Senhas.
3. Selecione um tipo e emita uma senha.
4. Abra o Guichê.
5. Chame a próxima senha.
6. Abra o Painel para visualizar a chamada.
7. No Guichê, faça uma segunda chamada ou inicie o atendimento.
8. Finalize o atendimento ou marque como não compareceu.
9. Abra o Histórico para consultar o registro.
10. Abra o Dashboard para visualizar os indicadores e gráficos.
Limitações atuais
O projeto é um protótipo acadêmico e possui algumas limitações importantes:
- os dados ficam apenas no localStorage do navegador;
- computadores diferentes não compartilham a mesma fila;
- não existe backend;
- não existe banco de dados centralizado;
- não existe autenticação ou controle de permissões;
- o Guichê utiliza Guichê 01 de forma fixa;
- a ordenação do Guichê é feita pela data de criação, sem regra de prioridade por SP, SE ou SG;
- o Histórico não acompanha automaticamente alterações feitas depois que a tela já foi aberta;
- os filtros de data do Histórico ainda podem ser refinados para trabalhar como intervalo completo;
- a massa de dados.json é carregada no primeiro uso e participa das telas e métricas atuais.
Possíveis evoluções
Para transformar o protótipo em uma aplicação multiusuário, uma arquitetura futura poderia usar:
React
  ↓
API / Backend
  ↓
Banco de dados
E para atualizações em tempo real:
Guichê
  ↓
Backend
  ↓
WebSocket
  ↓
Painel
Possíveis melhorias:
- backend e API REST;
- banco de dados centralizado;
- autenticação;
- perfis de acesso;
- vários guichês configuráveis;
- prioridades reais por tipo de senha;
- atualização em tempo real;
- WebSocket para o Painel;
- Histórico com atualização automática;
- filtro real por intervalo de datas;
- exportação de relatórios;
- logs e auditoria;
- testes automatizados.
Conceitos aplicados
O projeto demonstra conceitos como:
- componentes React;
- props;
- useState;
- useEffect;
- eventos;
- renderização condicional;
- React Router;
- SPA;
- localStorage;
- JSON;
- Array.map();
- Array.filter();
- Array.sort();
- formulários controlados;
- persistência local;
- polling com setInterval;
- Web Audio API;
- gráficos com Recharts;
- organização por páginas, componentes, services e estilos.
Resumo técnico
O sistema é uma SPA front-end em React. A emissão cria registros de atendimento e os salva em localStorage["senhas"]. O Guichê lê e altera esses mesmos registros conforme o fluxo do atendimento. O Painel consulta periodicamente a coleção e destaca as chamadas mais recentes. O Histórico permite pesquisar e filtrar os registros, enquanto o Dashboard calcula indicadores e gráficos sobre a mesma fonte de dados.
A implementação utiliza localStorage para simplificar o protótipo e demonstrar a integração entre os diferentes módulos da aplicação sem necessidade de backend ou banco de dados nesta etapa.
