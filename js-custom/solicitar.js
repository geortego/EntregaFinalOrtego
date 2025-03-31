document.addEventListener('DOMContentLoaded', () => {
  const serviciosContainer = document.getElementById('servicios-container');
  const solicitudList = document.getElementById('solicitud-list');
  const enviarSolicitudBtn = document.getElementById('enviar-solicitud');
  let serviciosSeleccionados = [];

  const nombre = localStorage.getItem('nombre') || 'Usuario';
  const apellido = localStorage.getItem('apellido') || '';
  const email = localStorage.getItem('email') || 'tu correo';

  const mensaje = `Bienvenido/a ${nombre} ${apellido}. Selecciona los servicios que deseas incluir en la agenda de la entrevista y asigna su relevancia. Al finalizar, confirma con el botón de Enviar Solicitud, y a la brevedad te estaremos respondiendo a tu email ${email}. Muchas gracias.`;

  document.getElementById('mensaje-usuario').textContent = mensaje;

  fetch('servicios.json')
    .then(response => response.json())
    .then(servicios => {
      servicios.forEach(servicio => {
        const servicioCard = document.createElement('div');
        servicioCard.classList.add('col-md-3', 'mb-3');
        servicioCard.innerHTML = `
          <div class="card">
            <img src="${servicio.imagen}" class="card-img-top" alt="${servicio.nombre}">
            <div class="card-body">
              <h5 class="card-title">${servicio.nombre}</h5>
              <p class="card-text">${servicio.descripcion}</p>
              <button class="btn btn-success seleccionar-servicio" data-id="${servicio.id}" data-nombre="${servicio.nombre}">Seleccionar</button>
            </div>
          </div>
        `;
        serviciosContainer.appendChild(servicioCard);
      });

      document.querySelectorAll('.seleccionar-servicio').forEach(boton => {
        boton.addEventListener('click', (e) => {
          const servicioId = e.target.getAttribute('data-id');
          const servicioNombre = e.target.getAttribute('data-nombre');
          const relevancia = prompt('Asigna una relevancia al Servicio, escribiendo el número correspondiente (1: Alta, 2: Media, 3: Baja):');
          if (relevancia >= 1 && relevancia <= 3) {
            serviciosSeleccionados.push({ id: servicioId, nombre: servicioNombre, relevancia });
            actualizarSolicitud();
            alert('Servicio agregado a la agenda.');
          } else {
            alert('Por favor, ingresa un valor válido (1, 2 o 3).');
          }
        });
      });
    })
    .catch(error => {
      console.error('Error al cargar los servicios:', error);
      serviciosContainer.innerHTML = '<p class="text-danger">No se pudieron cargar los servicios. Intenta nuevamente más tarde.</p>';
    });

  function actualizarSolicitud() {
    solicitudList.innerHTML = '';
    serviciosSeleccionados.forEach((servicio, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${servicio.nombre}</td>
        <td>${servicio.relevancia}</td>
        <td><button class="btn btn-danger btn-sm eliminar-servicio" data-index="${index}">Eliminar</button></td>
      `;
      solicitudList.appendChild(row);
    });

    document.querySelectorAll('.eliminar-servicio').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        serviciosSeleccionados.splice(index, 1);
        actualizarSolicitud();
      });
    });
  }

  if (enviarSolicitudBtn) {
    enviarSolicitudBtn.addEventListener('click', () => {
      if (serviciosSeleccionados.length === 0) {
        alert('No has seleccionado ningún servicio.');
        return;
      }

      const templateParams = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        orders: serviciosSeleccionados.map(servicio => ({
          name: servicio.nombre,
          relevancia: servicio.relevancia,
        })),
      };

      emailjs.send('service_q23wfsb', 'template_615gmdo', { ...templateParams, email: 'gustavo.ortego@gmail.com' })
        .then(response => {
          console.log('Correo enviado a HR-MZA:', response);

          emailjs.send('service_q23wfsb', 'template_615gmdo', { ...templateParams, email: email })
            .then(response => {
              alert('La solicitud se ha enviado correctamente a HR-MZA y al cliente.');
              console.log('Correo enviado al cliente:', response);
              serviciosSeleccionados = [];
              actualizarSolicitud();
            })
            .catch(error => {
              alert('Hubo un error al enviar el correo al cliente. Intenta nuevamente.');
              console.error('Error al enviar el correo al cliente:', error);
            });
        })
        .catch(error => {
          alert('Hubo un error al enviar el correo a HR-MZA. Intenta nuevamente.');
          console.error('Error al enviar el correo a HR-MZA:', error);
        });
    });
  } else {
    console.error('El botón "Enviar Solicitud" no se encontró en el DOM.');
  }
});