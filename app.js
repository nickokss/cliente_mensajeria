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
    'https://www.googleapis.com/auth/contacts.readonly'
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
      res.redirect('/buzon');
    } catch (error) {
      console.error('Error al intentar intercambiar el código de autorización:', error);
      res.status(500).send('Error interno del servidor al intercambiar el código');
    }
  } else {
    res.status(400).send('Código de autorización no encontrado');
  }
});

// OBTENER RECIBIDOS
async function obtenerRecibidos(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 10,
  });

  const mensajes = res.data.messages;
  return Promise.all(mensajes.map(async (mensaje) => {
    const detalle = await gmail.users.messages.get({
      userId: 'me',
      id: mensaje.id,
    });
    return {
      id: detalle.data.id,
      snippet: detalle.data.snippet, // Extracto del mensaje
      // Puedes añadir más detalles según necesites
    };
  }));
}

app.get('/api/recibidos', async (req, res) => {
  if (!oAuth2Client.credentials) {
    return res.status(401).send('Autenticación requerida');
  }
  try {
    const correos = await obtenerRecibidos(oAuth2Client);
    res.json(correos);
  } catch (error) {
    console.error('Error al obtener correos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// OBTENER CONTACTOS
async function obtenerContactos(auth) {
    const peopleService = google.people({version: 'v1', auth});
    try {
      const res = await peopleService.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses',
        pageSize: 10,
      });
  
      // Verifica si la respuesta incluye 'connections'
      if (!res.data.connections) {
        console.log('No se encontraron contactos.');
        return []; // Devuelve un arreglo vacío si no hay contactos
      }
  
      const contactos = res.data.connections.map(persona => {
        return {
          nombre: persona.names ? persona.names[0].displayName : 'Sin nombre',
          email: persona.emailAddresses ? persona.emailAddresses[0].value : 'Sin email'
        };
      });
  
      return contactos;
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      throw error; 
    }
}

app.get('/api/contactos', async (req, res) => {
  if (!oAuth2Client.credentials) {
    return res.status(401).send('Autenticación requerida');
  }
  try {
    const contactos = await obtenerContactos(oAuth2Client);
    res.json(contactos);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Configura Express para servir archivos estáticos del directorio 'public'
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta para la página de inicio/buzón de correos
app.get('/buzon', async (req, res) => {
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
