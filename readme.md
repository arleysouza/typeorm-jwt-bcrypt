# Servidor construído usando Express, TypeORM, JSON Web Token, Bcrypt e PostgreSQL
Projeto usado para testar o acesso ao SGBD com TypeORM e o controle de acesso com JWT e dois níveis de permissão (usuário e administrador).

## Modelo de dados da aplicação

![Texto alternativo para a imagem](https://github.com/arleysouza/typeorm-jwt-bcrypt/blob/master/imagens/modelo.png)

É necessário setar os parâmetros de acesso ao SGBD PostgreSQL no arquivo `src/add-data-source.ts`.

## Rotas
As rotas estão definidas no pacote `src/routes/`:
- A rota `/login` recebe pelo corpo da requisição um JSON com as propriedades: `{"re":"100","senha":"abc"}`. Como resultado será retornado o token gerado pelo JWT. A instrução `jwt.sign(usuario, process.env.JWT_SECRET)` para gerar o token está em `/src/middlewares`;
- Todas as demais rotas requerem o token, com os dados de login, enviado pelo header da requisição;
- As requisições `/usuario`, `/escala` e `/operacao`, para criar, atualizar e excluir, requerem que o usuário tenha o perfil de administrador. A checagem é feita na função `authAdmin` de `/src/middlewares`. Os parâmetros de validação são passados da middleware `authorization` para `authAdmin` através da propriedade `locals` do objeto `Response`;
- A requisição `/usuario/update/senha` permite ao usuário atualizar somente a própria senha;  
- A requisição `/operacao/active` é usada para tornar uma operação ativa. Pode existir apenas uma operação ativa, então as demais serão setadas para false.