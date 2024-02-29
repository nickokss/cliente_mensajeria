# Cliente de mensajería
- Aplicacion de un cliente de mensajeria
- Creado con NODE.JS
- Aquí se usa Google como host del protocolo SMTP
> [!IMPORTANT]
> Es necesario tener una cuenta de google y obtener las credenciales de OAuth 2.0 https://cloud.google.com/cloud-console?hl=es
  
## Plugins de Node instalados
Para acceder a los servicios de google:
```sh
npm install googleapi
```
Usamos el servidor express:
```sh
npm install express
```
Tambien usamos dotenv para cargar las variables de entorno que estarán en un archivo .env:
```sh
npm install dotenv
```

## Archivo .env estará en la raiz del proyecto
```.env
CLIENT_ID=tu_id_de_cliente_aquí
CLIENT_SECRET=tu_secreto_de_cliente_aquí
```

## Arrancar la aplicación
Nos situamos en la raiz del proyecto en una consola y ejecutamos:
```sh
node app.js
```
