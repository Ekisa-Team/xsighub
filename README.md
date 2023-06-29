# Xsighub

📝 Sistema Hub para capturar, transferir y mostrar las firmas de los usuarios en aplicaciones móviles y web en tiempo real.

## APK

https://github.com/Ekisa-Team/xsighub_mobile/releases

## Tutoriales

- **1. Referencia independiente**
  - https://www.loom.com/share/0cf35f842ee54840be28845bc5678939?sid=22541b7f-bd4b-4fc9-809e-aec4b4a6b076
- **2. Referencia de tipo documento**
  - https://www.loom.com/share/0db6d0b6fdb84bcdb52e47db513893e1?sid=1e049cb0-a4a2-4576-94c4-5d89391deef5
- **3. Visualizar documentos firmados o con firmas pendientes.**
  - https://www.loom.com/share/67509dcd1c5540e29cdb1e3a2e25fed9?sid=53d6445a-4ab3-40b7-80f0-c915cae7df3e
- **4. Personalizar firma**
  - https://www.loom.com/share/e5cee81ba2e44234b52dfaa0bc669525?sid=e244883b-c776-4a06-8ef0-c0446175d75b

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
