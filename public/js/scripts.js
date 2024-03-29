document.addEventListener('DOMContentLoaded', () => {
    // Carga inicial de mensajes recibidos
    cargarRecibidos();

    document.getElementById('recibidos').addEventListener('click', (e) => {
        e.preventDefault();
        actualizarTituloSeccion('Correos Recibidos');
        cargarRecibidos();
    });

    document.getElementById('enviados').addEventListener('click', (e) => {
        e.preventDefault();
        actualizarTituloSeccion('Correos Enviados');
        cargarEnviados();
    });

    document.getElementById('eliminados').addEventListener('click', (e) => {
        e.preventDefault();
        actualizarTituloSeccion('Correos Eliminados');
        cargarEliminados();
    });

    document.getElementById('contactos').addEventListener('click', (e) => {
        e.preventDefault();
        actualizarTituloSeccion('Contactos');
        cargarContactos();
    });

    document.getElementById('cantidad-mostrar').addEventListener('change', () => {
        // Suponiendo que tienes una forma de saber qué sección está actualmente activa,
        // puedes llamar a la función correspondiente. Aquí un ejemplo llamando a cargarRecibidos:
        cargarRecibidos();
    });

    document.querySelectorAll('.menu-lateral-link').forEach(link => {
        link.addEventListener('click', function() {
          document.querySelectorAll('.menu-lateral-link').forEach(item => {
            item.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
});

function actualizarTituloSeccion(titulo) {
    document.getElementById('titulo-seccion').textContent = titulo;
}

function mostrarSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
}

function ocultarSpinner() {
    document.getElementById('spinner').classList.add('hidden');
}

// Función para mostrar los correos basada en la cantidad seleccionada
function mostrarCorreos(correos) {
    document.getElementById('cantidad-mostrar').style.display = 'block';
    const cantidadMostrar = parseInt(document.getElementById('cantidad-mostrar').value);
    const contenidoCorreos = document.getElementById('contenido-principal');
    contenidoCorreos.innerHTML = ''; // Limpiar contenido anterior

    correos.slice(0, cantidadMostrar).forEach(mensaje => {
        const correoDiv = document.createElement('div');
        correoDiv.className = 'correo';

        // Crear y añadir el snippet del correo
        const snippetDiv = document.createElement('div');
        snippetDiv.textContent = mensaje.snippet;
        correoDiv.appendChild(snippetDiv);

        // Crear y añadir el botón de expansión
        const expandBtn = document.createElement('button');
        expandBtn.textContent = 'Ver más';
        expandBtn.addEventListener('click', function() {
            snippetDiv.textContent = mensaje.fullContent || mensaje.snippet; // Aquí necesitarás asegurarte de tener acceso al contenido completo del correo
        });
        correoDiv.appendChild(expandBtn);

        contenidoCorreos.appendChild(correoDiv);
    });
}

// Ajustar cargarRecibidos para usar mostrarCorreos
function cargarRecibidos() {
    mostrarSpinner();
    fetch('/api/recibidos')
        .then(response => response.json())
        .then(recibidos => {
            ocultarSpinner(); // Mover aquí para asegurar que se oculte correctamente
            mostrarCorreos(recibidos); // Actualizado para usar la nueva función
        })
        .catch(error => {
            console.error('Error al cargar mensajes:', error);
            ocultarSpinner();
        });
}

function cargarEnviados() {
    mostrarSpinner();
    fetch('/api/enviados')
        .then(response => response.json())
        .then(recibidos => {
            ocultarSpinner(); // Mover aquí para asegurar que se oculte correctamente
            mostrarCorreos(recibidos); // Actualizado para usar la nueva función
        })
        .catch(error => {
            console.error('Error al cargar mensajes:', error);
            ocultarSpinner();
        });
}

function cargarEliminados() {
    mostrarSpinner();
    fetch('/api/eliminados')
        .then(response => response.json())
        .then(recibidos => {
            ocultarSpinner(); // Mover aquí para asegurar que se oculte correctamente
            mostrarCorreos(recibidos); // Actualizado para usar la nueva función
        })
        .catch(error => {
            console.error('Error al cargar mensajes:', error);
            ocultarSpinner();
        });
}

function cargarContactos() {
    document.getElementById('cantidad-mostrar').style.display = 'none';
    fetch('/api/contactos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta del servidor no fue OK');
            }
            return response.json(); // Procesa la respuesta como JSON solo si la respuesta fue exitosa
        })
        .then(contactos => {
            const contenidoCorreos = document.getElementById('contenido-principal');
            contenidoCorreos.innerHTML = ''; // Limpiar contenido anterior
            mostrarSpinner();
            if(contactos.some(() => true)){
                ocultarSpinner();
                contactos.forEach(contacto => {
                    const elemento = document.createElement('div');
                    elemento.classList.add('p-4', 'border', 'border-gray-300', 'rounded', 'mb-2');
                    elemento.innerHTML = `<strong>Nombre:</strong> ${contacto.nombre} <br> <strong>Email:</strong> ${contacto.email}`;
                    contenidoCorreos.appendChild(elemento);
                });
            } else{
                ocultarSpinner();
                const elemento = document.createElement('div');
                elemento.classList.add('p-4', 'border', 'border-gray-300', 'rounded', 'mb-2');
                elemento.innerHTML = '<p>No tienes contactos</p>';
                contenidoCorreos.appendChild(elemento);
            }
        })
        .catch(error => {
            console.error('Error al cargar contactos:', error);
            // Aquí podrías actualizar el DOM para mostrar un mensaje de error
            const contenidoCorreos = document.getElementById('contenido-principal');
            contenidoCorreos.innerHTML = '<p>Hubo un error al cargar los contactos.</p>';
        });
}