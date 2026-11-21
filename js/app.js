// Menú hamburguesa para celular
const hamburger = document.querySelector('.hamburger');
const enlaces = document.querySelector('.enlaces-header');
const icono = hamburger.querySelector('i');

function cerrarMenu() {
  enlaces.classList.remove('activo');
  icono.classList.remove('fa-xmark');
  icono.classList.add('fa-bars');
}

hamburger.addEventListener('click', () => {
  const abierto = enlaces.classList.toggle('activo');
  icono.classList.toggle('fa-bars', !abierto);
  icono.classList.toggle('fa-xmark', abierto);
});

// Cierra el menú al tocar un enlace
enlaces.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', cerrarMenu);
});

// Cierra el menú si la pantalla vuelve a ser grande
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) cerrarMenu();
});