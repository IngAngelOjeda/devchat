# devchat

Real-time chat for developers. Retro terminal aesthetic. No auth.

---

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- Node.js 20+ _(solo para desarrollo local)_

---

## Variables de entorno

Copiá `.env.example` a `.env` y editá los valores:

```bash
cp .env.example .env
```

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3001` | Puerto interno del servidor Node |
| `MAX_MESSAGES` | `100` | Historial máximo por canal |
| `CORS_ORIGINS` | `http://localhost` | Orígenes permitidos (separar con coma si hay varios) |

---

## Levantar con Docker

```bash
./start.sh
```

O manualmente:

```bash
docker compose up --build -d
```

Abre `http://localhost`.

### Otros comandos útiles

```bash
# ver logs en vivo
docker compose logs -f

# bajar los contenedores
docker compose down

# rebuildar sin caché
docker compose build --no-cache
docker compose up -d
```

---

## Desarrollo local

```bash
# instalar dependencias
npm run install:all

# levantar server + client en paralelo
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`