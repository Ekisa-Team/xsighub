# Xsighub

📝 Sistema Hub para capturar, transferir y mostrar las firmas de los usuarios en aplicaciones móviles y web en tiempo real.

## Requisitos

- Node.js (versión 18 o superior): <https://nodejs.org/en/>
- PNPM: <https://pnpm.io/es/>

## Iniciar proyectos Server y SDK

1. Instalar `node_modules`.

   ```sh
   pnpm install
   ```

2. Ejecutar aplicaciones.

- Server (NestJS): [http://localhost:3000](http://localhost:3000)

  ```sh
  pnpm server:dev
  ```

- SDK (TS)

  ```sh
  pnpm sdk:dev
  ```

## Ejecutar ejemplos

- Angular

  ```sh
  pnpm examples:angular
  ```

## Docker

### Compilar imágenes

```sh
docker buildx build -t xsighub-server:latest -f Dockerfile.server .
```

### Ejecutar imágenes

```sh
docker run --env-file apps/server/envs/development.env -p 3000:3000 -d xsighub-server
```
