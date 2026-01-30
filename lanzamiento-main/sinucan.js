// ===== Inicializar Swiper Banner Principal =====
const swiper = new Swiper('.mySwiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  speed: 800,
  grabCursor: true,
});

// ===== Inicializar AOS (Animaciones) =====
AOS.init({
  duration: 1000,
  once: true,
  offset: 50
});

// ===== Cerrar menú móvil al hacer clic en enlaces =====
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      bootstrap.Collapse.getInstance(navbarCollapse).hide();
    }
  });
});

// ===== Activar link del menú según scroll =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ================= CARRITO DE COMPRAS (RESTAURADO) =================
let carrito = JSON.parse(localStorage.getItem('sinucan_carrito')) || [];

function guardarCarrito() {
  localStorage.setItem('sinucan_carrito', JSON.stringify(carrito));
  renderCarrito();
}

function renderCarrito() {
  const listContainer = document.getElementById('lista-carrito');
  const totalDisplay = document.getElementById('total-carrito');

  if (!listContainer || !totalDisplay) return;

  listContainer.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    listContainer.innerHTML = '<div class="text-center py-4 text-white-50">Tu carrito está vacío. Agrega algo rico para tu peludo.</div>';
    totalDisplay.innerText = '$0';
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row d-flex justify-content-between align-items-center mb-3 border-bottom border-white border-opacity-10 pb-2 text-white';
    row.innerHTML = `
            <div style="flex: 1;">
                <h6 class="fw-bold mb-1">${item.nombre}</h6>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-light btn-qty" data-index="${index}" data-delta="-1">-</button>
                    <span class="fw-bold" style="min-width: 20px; text-align: center;">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-light btn-qty" data-index="${index}" data-delta="1">+</button>
                </div>
            </div>
            <div class="text-end" style="min-width: 100px;">
                <div class="text-primary fw-bold mb-1">$${subtotal.toLocaleString()}</div>
                <button class="btn btn-link text-danger p-0 small btn-delete" data-index="${index}">
                    <i class="fas fa-trash-alt me-1"></i> Borrar
                </button>
            </div>
        `;
    listContainer.appendChild(row);
  });

  totalDisplay.innerText = `$${total.toLocaleString()} COP`;
}

// Delegación de eventos para el carrito
const listaCarritoElement = document.getElementById('lista-carrito');
if (listaCarritoElement) {
  listaCarritoElement.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const index = parseInt(btn.dataset.index);

    if (btn.classList.contains('btn-delete')) {
      if (confirm('¿Deseas eliminar este producto del carrito?')) {
        carrito.splice(index, 1);
        guardarCarrito();
      }
    } else if (btn.classList.contains('btn-qty')) {
      const delta = parseInt(btn.dataset.delta);
      carrito[index].cantidad += delta;
      if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
      }
      guardarCarrito();
    }
  });
}

// Handler para agregar productos
function initAddingButtons() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.onclick = (e) => {
      const button = e.currentTarget;
      const nombre = button.dataset.nombre;
      const precio = parseInt(button.dataset.precio);
      const parent = button.closest('.d-flex');
      const input = parent ? parent.querySelector('input') : null;
      const cantidad = parseInt(input ? input.value : 1) || 1;

      const idx = carrito.findIndex(p => p.nombre === nombre);
      if (idx > -1) {
        carrito[idx].cantidad += cantidad;
      } else {
        carrito.push({ nombre, precio, cantidad });
      }

      if (input) input.value = 1;

      // Efecto visual
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> OK';
      button.classList.replace('btn-primary', 'btn-success');

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.replace('btn-success', 'btn-primary');
      }, 1000);

      guardarCarrito();
      document.getElementById('carrito')?.scrollIntoView({ behavior: 'smooth' });
    };
  });
}

// Finalizar pedido
function configurarFinalizarPedido() {
  const btn = document.getElementById('btn-finalizar-whatsapp');
  if (btn) {
    btn.onclick = () => {
      if (carrito.length === 0) {
        alert('El carrito está vacío.');
        return;
      }

      let text = '🐶 *NUEVO PEDIDO SINUCAN FOOD* 🐶\n\n';
      let total = 0;
      carrito.forEach(p => {
        const sub = p.precio * p.cantidad;
        total += sub;
        text += `✔️ ${p.nombre} (x${p.cantidad}) - $${p.precio.toLocaleString()}\n`;
      });
      text += `\n💰 *TOTAL: $${total.toLocaleString()} COP*`;
      text += `\n\n📍 *Dirección de entrega:* \n(Escribe aquí)`;

      const url = `https://wa.me/573235882174?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    };
  }
}

// ================= OTROS SCRIPTS =================

// Botones de Planes -> Contacto
document.querySelectorAll('.btn-plan').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const planCard = btn.closest('.plan-card');
    const servicio = planCard ? planCard.dataset.servicio : 'un plan';
    const mensajeInput = document.querySelector('#mensaje');

    if (mensajeInput) {
      mensajeInput.value = `Hola, estoy interesado en el ${servicio}. ¿Podrían darme más información?`;
    }

    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Galería Swiper
new Swiper('.gallerySwiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  autoplay: { delay: 2500, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 }
  },
  speed: 800,
  grabCursor: true,
});

// Inicialización final
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  renderCarrito();
  initAddingButtons();
  configurarFinalizarPedido();
});