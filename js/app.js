document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const enlaces = document.querySelector('.enlaces-header');
  const icono = hamburger.querySelector('i');
  const sinAnimaciones = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===== 1. MENÚ HAMBURGUESA ===== */
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

  enlaces.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrarMenu));

  // Cierra el menú si se toca fuera de él
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) cerrarMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) cerrarMenu();
  });


  /* ===== 2. BARRA DE PROGRESO + BOTÓN VOLVER ARRIBA ===== */
  const barra = document.createElement('div');
  barra.className = 'barra-progreso';
  document.body.appendChild(barra);

  const botonArriba = document.createElement('button');
  botonArriba.className = 'boton-arriba';
  botonArriba.setAttribute('aria-label', 'Volver arriba');
  botonArriba.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(botonArriba);

  botonArriba.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function alHacerScroll() {
    const scroll = window.scrollY;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (alto > 0 ? (scroll / alto) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', scroll > 50);
    botonArriba.classList.toggle('visible', scroll > 400);
  }

  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();


  /* ===== 3. ANIMACIÓN AL APARECER (scroll reveal) ===== */
  const elementos = document.querySelectorAll(
    '.servicio, .number, .texto-pregunta, .pregunta > img, .results-text, .servicios > img, .box-skills h4, .partfooter'
  );

  if (sinAnimaciones || !('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visible'));
  } else {
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const el = entrada.target;
          el.classList.add('visible');
          observador.unobserve(el);
          // quita el retraso después de aparecer para que el hover responda rápido
          setTimeout(() => (el.style.transitionDelay = ''), 1200);
        });
      },
      { threshold: 0.15 }
    );

    elementos.forEach((el) => {
      el.classList.add('reveal');
      // escalonado: cada elemento del mismo grupo aparece un poco después
      const hermanos = Array.from(el.parentElement.children);
      el.style.transitionDelay = (hermanos.indexOf(el) % 6) * 0.12 + 's';
      observador.observe(el);
    });
  }


  /* ===== 4. CONTADORES ANIMADOS (+887) ===== */
  function animarContador(h4) {
    const texto = h4.textContent.trim();
    const meta = parseInt(texto.replace(/\D/g, ''), 10);
    if (isNaN(meta)) return;
    const prefijo = texto.startsWith('+') ? '+' : '';
    const duracion = 2000;
    const inicio = performance.now();

    function paso(ahora) {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - progreso, 3); // desacelera al final
      h4.textContent = prefijo + Math.floor(meta * suave).toLocaleString('es-CO');
      if (progreso < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  const contadores = document.querySelectorAll('.number h4');
  if (!sinAnimaciones && 'IntersectionObserver' in window) {
    const obsContadores = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            obsContadores.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    contadores.forEach((c) => obsContadores.observe(c));
  }


  /* ===== 5. EFECTO DE ESCRITURA EN EL TÍTULO ===== */
  const titulo = document.querySelector('.texto-header h1');
  if (titulo && !sinAnimaciones) {
    const textoFinal = titulo.textContent;
    titulo.textContent = '';
    titulo.classList.add('escribiendo');
    let i = 0;
    const escribir = setInterval(() => {
      titulo.textContent += textoFinal[i];
      i++;
      if (i >= textoFinal.length) {
        clearInterval(escribir);
        setTimeout(() => titulo.classList.remove('escribiendo'), 1200);
      }
    }, 90);
  }


  /* ===== 6. EFECTO 3D EN LAS TARJETAS (solo con mouse) ===== */
  if (window.matchMedia('(hover: hover)').matches && !sinAnimaciones) {
    document.querySelectorAll('.servicio').forEach((tarjeta) => {
      tarjeta.addEventListener('mousemove', (e) => {
        const caja = tarjeta.getBoundingClientRect();
        const x = (e.clientX - caja.left) / caja.width - 0.5;
        const y = (e.clientY - caja.top) / caja.height - 0.5;
        tarjeta.style.transform =
          `translateY(-10px) perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      });
      tarjeta.addEventListener('mouseleave', () => {
        tarjeta.style.transform = '';
      });
    });
  }
});
