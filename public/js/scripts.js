document.addEventListener('DOMContentLoaded', () => {
    // Carga inicial de mensajes recibidos
    cargarRecibidos();

    document.getElementById('recibidos').addEventListener('click', (e) => {
        e.preventDefault();
        cargarRecibidos();
    });

    document.getElementById('contactos').addEventListener('click', (e) => {
        e.preventDefault();
        cargarContactos();
    });
});

function cargarRecibidos() {
    fetch('/api/recibidos')
        .then(response => response.json())
        .then(mensajes => {
            const contenidoCorreos = document.getElementById('contenido-principal');
            contenidoCorreos.innerHTML = ''; 

            // Crear y añadir elementos para cada mensaje
            mensajes.forEach(mensaje => {
                const elemento = document.createElement('div');
                elemento.classList.add('bg-white', 'p-4', 'rounded', 'shadow', 'mb-4');
                elemento.textContent = mensaje.snippet;
                contenidoCorreos.appendChild(elemento);
            });
        })
        .catch(error => console.error('Error al cargar mensajes:', error));
}

function cargarContactos() {
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

            contactos.forEach(contacto => {
                const elemento = document.createElement('div');
                elemento.classList.add('p-4', 'border', 'border-gray-300', 'rounded', 'mb-2');
                elemento.innerHTML = `<strong>Nombre:</strong> ${contacto.nombre} <br> <strong>Email:</strong> ${contacto.email}`;
                contenidoCorreos.appendChild(elemento);
            });
        })
        .catch(error => {
            console.error('Error al cargar contactos:', error);
            // Aquí podrías actualizar el DOM para mostrar un mensaje de error
            const contenidoCorreos = document.getElementById('contenido-principal');
            contenidoCorreos.innerHTML = '<p>Hubo un error al cargar los contactos.</p>';
        });
}