# API DE UM PRODUTO SIMILAR AO TWITTER

:rocket:

## Começando

- Clone este repositório.
- \$ Rode `yarn` no diretório raiz.
- \$ yarn dev

## Authentication

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

#### OutPut:

```
{
	"name": "Ítalo Lima",
   	"email": "italo@email.com",
	"createdAt": "2020-05-02T13:40:36.601Z",
	"updatedAt": "2020-05-02T13:40:36.601Z"
}
```

### Signin:

`POST /sessions`: login com credenciais válidas.

#### Body example:

```
{
	"email": "italo@email.com",
	"password": "123456"
}
```

### OutPut

```
{
  "name": "Ítalo Lima",
  "email": "italo@email.com",
  "createdAt": "2020-05-02T13:40:56.601Z",
  "updatedAt": "2020-05-02T12:37:56.967Z",
  "token": TokenJWT"
}
```
