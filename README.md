# API DE UM PRODUTO SIMILAR AO TWITTER

:rocket:

## Começando

- Clone este repositório.
- \$ Rode `yarn` no diretório raiz.
- \$ yarn dev

## Authentication

### Signin:

`POST /session`: login com credenciais válidas.

#### Body example:

```
{
	"email": "italo@email.com",
	"password": "123456"
}
```

## Publications Informations

`GET /publication/all`: retorna todas as publicações, ordenados pela data mais recente.

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

#### :warning: A execução dos endpoints a seguir, necessitam de autenticação do usuário

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

## Publication

`POST /publication`: cria uma nova publicação.

#### Body example:

```
{
	"description": "Publicação 1"
}
```

`GET /publication`: retorna informações das publicações pertencentes ao usuário autenticado.

`PUT /publication/:id`: altera a informação da publicação desejada, pertencente ao usuário autenticado.
`id :point_right: identificador da publicação`

#### Body example:

```
{
	"description": "Publicação 1 alterada"
}
```

`DELETE /publication/:id`: exclui uma publicação desejada, pertencente ao usuário autenticado.
`id :point_right: identificador da publicação`
