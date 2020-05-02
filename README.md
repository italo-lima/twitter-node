# API DE UM PRODUTO SIMILAR AO TWITTER

:rocket:

## Começando

- Clone este repositório.
- \$ Rode `yarn` no diretório raiz.
- \$ yarn dev

## Authentication

### Signin:

`POST /sessions`: login com credenciais válidas.

#### Body example:

```
{
	"email": "italo@email.com",
	"password": "123456"
}
```

## User

### Signup:

`POST /users`: cria um novo usuário.

#### Body example:

```
{
	"name": "Ítalo Lima",
	"email": "italo@email.com",
	"password": "123456"
}
```
#### A execução dos endpoint's a seguir, necessitam de autenticação do usuário

`GET /users`: Retorna informações do usuário autenticado.

`PUT /users`: altera informações do usuário autenticado.

#### Body example:

```
{
	"name": "Ítalo",
	"password": "1234567"
}
```

`DELETE /users`: exclui a conta do usuário autenticado.
```
