# 📚 Documentação da API

Aqui você encontra a documentação detalhada dos principais casos de uso da API, com exemplos práticos para facilitar o desenvolvimento.

---

## 🧑‍💻 Autenticação

### Registrar Usuário
`POST /users`

- Cria um novo usuário comum ou admin (se accessToken válido for enviado).
- **Headers:**
  - `Content-Type: application/json`
  - `accessToken` (opcional, para admin)
- **Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com"
}
```
- **Observações:**
  - Se enviar um accessToken válido, o usuário será admin.
  - Se não enviar, será USER.
  - Se o accessToken for inválido ou já utilizado, retorna 403.

---

### Login
`POST /auth/login`

- **Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senhaSegura123"
}
```
- **Response:**
```json
{
  "token": "<jwt>"
}
```

---

## 🏢 Salas de Reunião

### Criar Sala
`POST /meeting-rooms`

- **Headers:**
  - `Authorization: Bearer <token>` (usuário autenticado)
- **Body:**
```json
{
  "name": "Sala 1",
  "description": "Sala grande",
  "capacity": 10
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "Sala 1",
  "description": "Sala grande",
  "capacity": 10,
  "ownerId": 2,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Listar Salas Públicas e Horários Disponíveis
`GET /meeting-rooms/list?date=YYYY-MM-DD`

- **Sem autenticação**
- **Query params:**
  - `date` (opcional, formato `YYYY-MM-DD`)
- **Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Sala 1",
      "description": "Sala grande",
      "capacity": 10,
      "ownerId": 2,
      "createdAt": "...",
      "updatedAt": "...",
      "availableHours": ["08:00-09:00", "09:00-10:00"],
      "date": "2024-07-21"
    }
  ],
  "total": 1
}
```

---

### Listar Minhas Salas
`GET /meeting-rooms/mine`

- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
```json
{
  "data": [ ... ],
  "total": 1
}
```

---

### Ver Reservas de uma Sala
`GET /meeting-rooms/{id}/bookings`

- **Headers:**
  - `Authorization: Bearer <token>` (dono da sala)
- **Response:**
```json
{
  "data": [
    {
      "id": 1,
      "meetingRoomId": 1,
      "userId": 3,
      "startDate": "2024-07-21T13:00:00.000Z",
      "endDate": "2024-07-21T14:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

## 📅 Reservas

### Criar Reserva
`POST /bookings`

- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
```json
{
  "meetingRoomId": 1,
  "startDate": "2024-07-21T13:00:00.000Z",
  "endDate": "2024-07-21T14:00:00.000Z"
}
```
- **Response:**
```json
{
  "id": 1,
  "meetingRoomId": 1,
  "userId": 3,
  "startDate": "2024-07-21T13:00:00.000Z",
  "endDate": "2024-07-21T14:00:00.000Z"
}
```

---

### Listar Minhas Reservas
`GET /bookings/mine`

- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
```json
{
  "data": [ ... ],
  "total": 1
}
```

---

### Cancelar Reserva
`DELETE /bookings/{id}`

- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - 204 No Content (sucesso)

---

## 🔐 Observações Gerais

- Todas as datas e horários são tratados em UTC.
- Rotas protegidas exigem JWT no header Authorization.
- Para criar admin, utilize accessToken conforme explicado no README.

---

## 📏 Regras de Negócio

### Usuários
- Apenas usuários autenticados podem criar, editar ou deletar salas e reservas.
- Apenas usuários com accessToken válido podem ser criados como administradores (COWORKING_ADMIN). Caso contrário, são criados como USER.
- O campo 'role' nunca é aceito no body da request, é definido apenas pelo backend.

### Salas de Reunião
- Apenas o dono (ownerId) pode deletar uma sala.
- Não é possível criar salas sem nome, descrição e capacidade válidos.
- Capacidade deve ser maior que zero.

### Reservas
- Apenas usuários autenticados podem criar ou cancelar reservas.
- Não é possível reservar horários passados.
- Reservas devem ser feitas em blocos de 1 hora, sempre iniciando em hora cheia (ex: 08:00-09:00).
- Não é permitido sobrepor reservas: não pode haver duas reservas para a mesma sala e horário.
- Apenas o usuário que criou a reserva pode cancelá-la (ou um admin, se implementado).

### Listagem de Salas e Horários
- A listagem pública de salas (`/meeting-rooms/list`) mostra apenas horários disponíveis para o dia informado (ou atual, se não informado), sempre em UTC.
- Horários disponíveis são das 08:00 às 18:00, em blocos de 1h.
- Horários já reservados não aparecem como disponíveis.

### Tokens e Segurança
- AccessTokens de admin são de uso único e consumidos após uso.
- Se um accessToken inválido ou já utilizado for enviado, a criação de admin é negada (403).
- JWT é obrigatório para rotas protegidas.

--- 