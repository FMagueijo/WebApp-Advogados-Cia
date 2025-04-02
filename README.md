# Setup
## Ficheiros Necessarios (Não Disponibilizados)
- ".env" - na raiz do projeto.

## Abrir Webapp
### Pre-requisitos
- Ter Mysql e Apache ligados através do XAMPP 
- Certificar-se que a porta do Mysql é a 3306

### Iniciar Webapp
- Abrir Projeto no Visual Studio Code.
- Abrir Terminal (Bash).
- Executar o comando "npm run fast-dev" para abrir e fazer todos os processos necessarios para abrir a Webapp.
- Esperar executar e clicar no link "localhost:<port>".

## Fazer Alterações á BD
- Fazer alteração no ficheiro "./prisma/schema.prisma".
- Abrir Terminal (Bash).
- Executar o comando "npm run make-schema-edit" para executar migracao da BD.
- Feito.