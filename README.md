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

2. Ejecutar proyecto.

  ```sh
  pnpm dev
  ```

## Ejecutar ejemplos

- Angular

  ```sh
  pnpm examples:angular
  ```

### Realizar despliegue

Para desplegar una nueva versión de este proyecto, se deben seguir los siguientes pasos:

1. Ejecutar el script `./scripts/release.sh` y seguir las instrucciones para especificar el tipo de versión que desea publicar ("major", "minor" o "patch") y si desea agregar un alcance a la versión (por ejemplo, "alpha", "beta" o "stable").

2. Verificar que los cambios y la etiqueta de Git se hayan publicado correctamente en el repositorio remoto. Adicionalmente, debe haber un workflow generando generando la imagen de docker en ghcr y los paquetes de la aplicación deberían estar publicados en NPM.

## Docker

### Compilar imágenes

```sh
docker buildx build -t xsighub-server:latest -f Dockerfile.server .
```

### Ejecutar imágenes

```sh
docker run --env-file apps/server/envs/development.env -p 3000:3000 -d xsighub-server
```
