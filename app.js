require('dotenv').config();
const express = require('express');
const {google} = require('googleapis');

const app = express();

// Carga las variables de entorno
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// Configura el cliente OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Ruta para iniciar el flujo de autenticación
app.get('/auth/google', (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ];

  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Esto asegura que recibamos un refreshToken
  });

  res.redirect(url);
});

// Ruta para manejar el callback de Google OAuth
app.get('/oauth2callback', async (req, res) => {
  const {code} = req.query;
  if (code) {
    try {
      // Intercambia el código por tokens
      const {tokens} = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Redirigir al usuario a la página de inicio
      res.redirect('/inicio');
    } catch (error) {
      console.error('Error al intentar intercambiar el código de autorización:', error);
      res.status(500).send('Error interno del servidor al intercambiar el código');
    }
  } else {
    res.status(400).send('Código de autorización no encontrado');
  }
});

// Configura Express para servir archivos estáticos del directorio 'public'
app.use(express.static('public'));

// Ruta para la página de inicio/buzón de correos
app.get('/inicio', async (req, res) => {
  if (!oAuth2Client.credentials) {
    return res.redirect('/auth/google');
  }
  
  // Aquí podrías llamar a una función para obtener correos usando la API de Gmail
  // y enviar esos datos a tu cliente para mostrarlos.
  // Por simplicidad, solo estamos sirviendo una página estática.
  res.sendFile(__dirname + '/public/buzon.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
