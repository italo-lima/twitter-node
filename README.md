# API DE UM PRODUTO SIMILAR AO TWITTER

:rocket: API desenvolvida com NodeJS + MongoDB + JWT + Jest

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

`PUT /publication/:id`: altera as informações da publicação desejada, pertencente ao usuário autenticado.

:point_right: id representa o identificador da publicação

#### Body example:

```
{
	"description": "Publicação 1 alterada"
}
```

`DELETE /publication/:id`: exclui uma publicação desejada, pertencente ao usuário autenticado.

:point_right: id representa o identificador da publicação

## Comment

`POST /comment?publicationID=value`: cria um novo comentário em determinada publicação.

:point_right: publicationID representa o identificador da publicação que irá receber um comentário

#### Body example:

```
{
	"comment_description": "Comentário 1"
}
```

`GET /comment`: retorna todos os comentários das publicações pertencentes ao usuário logado.

`GET /comment/my-comments`: retorna todos os comentários pertencentes ao usuário logado, registradas em publicações de outros usuários.

`PUT /comment/:id`: altera as informações do comentário desejado, pertencente ao usuário autenticado.

:point_right: id representa o identificador do comentário

#### Body example:

```
{
	"comment_description": "Comentário 1 atualizado"
}
```

`DELETE /comment/:id`: exclui um comentário desejado, pertencente ao usuário autenticado.

:point_right: id representa o identificador do comentário
