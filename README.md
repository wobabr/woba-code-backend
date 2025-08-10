# API – Node.js + TypeScript + PostgreSQL

Este projeto é um **MVP de uma API RESTful** em Node.js usando **Express**, **TypeScript**, **Prisma** e **PostgreSQL**, estruturado segundo os princípios da **Clean Architecture**.

---

## Arquitetura Hexagonal (Ports & Adapters)

O projeto adota conceitos da **Arquitetura Hexagonal**, promovendo separação de responsabilidade. Os principais pontos são:

- **Domínio isolado**: Toda a lógica de negócio está em `src/domain/` (entidades, casos de uso, repositórios e serviços de domínio).
- **Portas**: Interfaces de repositórios e serviços no domínio, que definem contratos para comunicação.
- **Adaptadores**: Implementações concretas de repositórios, serviços, controladores HTTP, etc., ficam em `src/infra/`.
- **Inversão de dependência**: O domínio não depende de frameworks, apenas de contratos (interfaces). As dependências são injetadas via IoC.
---

## 🚀 Como executar o projeto

### 1. Clone e instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

Crie um `.env` com:

```
DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=seu_segredo
PORT=3000
```

### 3. Execute as migrations e o seed

```bash
npx prisma migrate dev
npm run seed
```

### 4. Rode o projeto

```bash
npm run dev
```

---

## 🐳 Docker

### Subir ambiente com PostgreSQL

```bash
docker-compose up --build
docker-compose exec api npx prisma migrate dev
```
---

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes unitários
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm run test:watch
```
---

## 📖 Documentação

Acesse a documentação completa de endpoints, exemplos de uso e regras de negócio em:

[docs/endpoints.md](./docs/endpoints.md)

---
