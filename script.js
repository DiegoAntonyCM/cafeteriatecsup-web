// 🍋 Carrito de compras global
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 🔄 Actualiza el carrito y muestra totales
function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  const subtotalElem = document.getElementById('subtotal');
  const impuestosElem = document.getElementById('impuestos');
  const totalElem = document.getElementById('total');

  if (!lista) return;
  lista.innerHTML = '';

  let subtotal = 0;
  carrito.forEach(item => {
    const li = document.createElement('li');
    if (item.nombre && item.volumen) {
      li.innerHTML = `
        <div class="item">
          <img src="${item.img}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <div class="item-details">
            <h4>${item.nombre}</h4>
            <p>${item.volumen}</p>
            <p><strong>Precio:</strong> S/ ${item.precio.toFixed(2)}</p>
          </div>
        </div>
      `;
    } else {
      li.innerHTML = item.detalle || '';
    }
    lista.appendChild(li);
    subtotal += item.precio || 0;
  });

  const impuestos = subtotal * 0.18;
  const total = subtotal + impuestos;

  if (subtotalElem) subtotalElem.textContent = `S/ ${subtotal.toFixed(2)}`;
  if (impuestosElem) impuestosElem.textContent = `S/ ${impuestos.toFixed(2)}`;
  if (totalElem) totalElem.textContent = `S/ ${total.toFixed(2)}`;

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function vaciarCarrito() {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.removeItem("carrito");
}

// ===================== MENÚ SEMANAL =====================
function mostrarDia(diaId) {
  document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
  const diaActivo = document.getElementById(diaId);
  if (diaActivo) diaActivo.classList.add('active');

  document.querySelectorAll('.day-selector button').forEach(btn => btn.classList.remove('active-button'));
  const boton = document.querySelector(`button[data-dia="${diaId}"]`);
  if (boton) boton.classList.add('active-button');

  vaciarCarrito();
}

function obtenerDetalleMenu(plato) {
  const texto = plato.querySelector('p')?.textContent || '';
  const diaContenedor = plato.closest('.day'); // busca dentro del mismo día
  const parrafos = diaContenedor?.querySelectorAll('.plato p') || [];
  const img = plato.querySelector('img')?.getAttribute('src') || 'img/default.jpg';

  let entrada = '', sopa = '', fondo = '', fruta = '', refresco = '';

  parrafos.forEach(p => {
    const txt = p.textContent || '';
    if (txt.includes('Entrada')) entrada = txt;
    if (txt.includes('Sopa')) sopa = txt;
    if (txt.includes('Fondo')) fondo = txt;
    if (txt.includes('Fruta')) fruta = txt;
    if (txt.includes('Refresco')) refresco = txt;
  });

  if (texto.includes('Menú Completo')) {
    return {
      nombre: "Menú Completo",
      volumen: `${entrada}, ${sopa}, ${fondo}, ${fruta}, ${refresco}`,
      precio: 8,
      img
    };
  } else if (texto.includes('Menú sin Sopa')) {
    return {
      nombre: "Menú sin Sopa",
      volumen: `${entrada}, ${fondo}, ${fruta}, ${refresco}`,
      precio: 6,
      img
    };
  } else {
    return {
      nombre: texto,
      volumen: '',
      precio: 0,
      img
    };
  }
}
window.addEventListener('DOMContentLoaded', () => {
  // Para menú semanal
  const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = new Date().getDay();
  const diaActual = dias[hoy];
  const diasValidos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

  mostrarDia(diasValidos.includes(diaActual) ? diaActual : 'lunes');

  document.querySelectorAll('.day-selector button').forEach(button => {
    button.addEventListener('click', () => {
      const dia = button.getAttribute('data-dia');
      mostrarDia(dia);
    });
  });

  document.querySelectorAll('.plato').forEach(plato => {
    const texto = plato.querySelector('p')?.textContent.toLowerCase();
    if (texto.includes('menú completo') || texto.includes('menú sin sopa')) {
      const btn = document.createElement('button');
      btn.textContent = 'Agregar al carrito';
      btn.classList.add('agregar-btn');
      plato.appendChild(btn);

      btn.addEventListener('click', () => {
        const detalle = obtenerDetalleMenu(plato);
        carrito.push(detalle);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
      });
    }
  });

  actualizarCarrito();

  // Para detectar ?categoria=snacks o ?categoria=bebidas en otra vista
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (categoria) {
    const lower = categoria.toLowerCase();
    if (lower === "snacks") {
      if (typeof renderizarProductos === "function") renderizarProductos(snacks);
    } else if (lower === "bebidas") {
      if (typeof renderizarProductos === "function") renderizarProductos(gaseosas);
    }
  }

  // En caso haya lista de categorías (aside) en esta misma página
  document.querySelectorAll("aside ul li").forEach(li => {
    li.addEventListener("click", (e) => {
      const cat = li.textContent.trim().toLowerCase();
      e.preventDefault();

      if (cat === "snacks") {
        if (typeof renderizarProductos === "function") renderizarProductos(snacks);
        history.replaceState(null, "", "?categoria=snacks");
      } else if (cat === "bebidas") {
        if (typeof renderizarProductos === "function") renderizarProductos(gaseosas);
        history.replaceState(null, "", "?categoria=bebidas");
      }
    });
  });
});
