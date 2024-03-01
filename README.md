# MAILWAVE
- Aplicación de un cliente de mensajería
- Creado con NODE.JS
- Aquí se usa Google como host del protocolo SMTP, pero podrías usar otros
> [!IMPORTANT]
> * Es necesario tener una cuenta de Google y obtener las credenciales de OAuth 2.0 aquí https://cloud.google.com/cloud-console?hl=es
> * A parte de eso ahi dentro de Google Cloud en las bibliotecas de API es necesario activar la de Gmail y Personas

> [!IMPORTANT]
> Esta web usa *tailwind.css* y puedes instalarlo así https://tailwindcss.com/docs/installation

## Plugins de Node instalados
Para acceder a los servicios de Google:
```sh
npm install googleapi
```
Usamos el servidor express:
```sh
npm install express
```
También usamos dotenv para cargar las variables de entorno que estarán en un archivo .env:
```sh
npm install dotenv
```

## Archivo .env estará en la raíz del proyecto
Credenciales de OAuth 2.0:
```.env
CLIENT_ID=tu_id_de_cliente_aquí
CLIENT_SECRET=tu_secreto_de_cliente_aquí
```

## Arrancar la aplicación
Nos situamos en la raíz del proyecto en una consola y ejecutamos:
```sh
node app.js
```
