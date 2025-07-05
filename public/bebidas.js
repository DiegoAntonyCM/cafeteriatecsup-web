// ===================== PRODUCTOS =====================
const gaseosas = [
  { nombre: "COCA - COLA", volumen: "600 ml", precio: 3.00, img: "https://oechsle.vteximg.com.br/arquivos/ids/1352403/image-9a2c494b0e684acf9f32590e885b7b6e.jpg?v=637494735762730000" },
  { nombre: "INKA - COLA", volumen: "600 ml", precio: 2.50, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTTepdkao4bHLzt50pbD6oqnXfhNDEXh-FtQ&s" },
  { nombre: "SPRITE", volumen: "600 ml", precio: 3.00, img: "https://media.cnn.com/api/v1/images/stellar/prod/cnne-1244626-220727132408-20220727-new-sprite-bottle-full-169.jpg?c=original" },
  { nombre: "ENERGINA", volumen: "600 ml", precio: 2.50, img: "https://group-ism.com/wp-content/uploads/2023/06/energina-b-01.png" },
  { nombre: "BLACK", volumen: "600 ml", precio: 2.50, img: "https://group-ism.com/wp-content/uploads/2023/06/Black-ch.jpg" },
  { nombre: "FANTA NARANJA", volumen: "600 ml", precio: 2.50, img: "https://www.coca-cola.com/content/dam/onexp/bo/es/brands/fanta/fanta-naranja.jpg" },
  { nombre: "FANTA FRESA", volumen: "600 ml", precio: 2.50, img: "https://www.mercadolibre.com.pe/refresco-frutal-fanta-fresa-600ml/p/MPE18979510" },
];

const snacks = [
  { nombre: "PAPAS LAYS", volumen: "35 g", precio: 2.00, img: "https://www.lays.com/sites/lays.com/files/2022-10/PL_Classic.png" },
  { nombre: "DORITOS", volumen: "40 g", precio: 2.50, img: "https://www.doritos.com/sites/doritos.com/files/2022-01/doritos_nachocheese.png" },
  { nombre: "CHIFLES", volumen: "50 g", precio: 1.50, img: "https://www.peru.travel/Contenido/Productos/Imagen/es/27/1.1/chifles.jpg" },
  { nombre: "PRINGLES", volumen: "40 g", precio: 3.50, img: "https://images.heb.com/is/image/HEBGrocery/pringles-potato-crisps-chips-original-5-2-oz-000023289.jpg" },
];

const postres = [
  { nombre: "HELADO D'ONOFRIO", volumen: "150 ml", precio: 3.50, img: "https://www.donofrio.com.pe/sites/default/files/styles/variable_width_800/public/2020-11/01_LIMON%C3%81_0.png" },
  { nombre: "GELATINA", volumen: "120 ml", precio: 2.00, img: "https://images.rappi.pe/products/1807341167-1623272911206.png" },
  { nombre: "FLAN", volumen: "130 ml", precio: 2.50, img: "https://www.recetasnestle.com.pe/sites/default/files/styles/recipe_detail_desktop/public/srh_recipes/9b78015ef803b39b47e6a2c0a66ab1ef.webp?itok=pBGZ9TGu" },
  { nombre: "ARROZ CON LECHE", volumen: "150 ml", precio: 2.50, img: "https://cdn7.kiwilimon.com/recetaimagen/37391/th5-640x426-28469.jpg" },
];

// ===================== CARRITO =====================
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  const subtotalElem = document.getElementById('subtotal');
  const igvElem = document.getElementById('igv');
  const totalElem = document.getElementById('carrito-total');

  if (lista) lista.innerHTML = '';
  let total = 0;

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('item-carrito');
    div.innerHTML = `
      <div class="info-carrito" style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.img}" alt="${item.nombre}" style="width: 40px; height: 40px;">
        <div>
          <strong>${item.nombre}</strong><br>
          ${item.volumen} - S/ ${item.precio.toFixed(2)}
        </div>
      </div>
      <button class="eliminar-btn" data-index="${index}">Eliminar</button>
    `;
    if (lista) lista.appendChild(div);
    total += item.precio;
  });

  const subtotal = total / 1.18;
  const igv = total - subtotal;

  if (subtotalElem) subtotalElem.textContent = `Subtotal: S/ ${subtotal.toFixed(2)}`;
  if (igvElem) igvElem.textContent = `IGV (18%): S/ ${igv.toFixed(2)}`;
  if (totalElem) totalElem.textContent = `Total: S/ ${total.toFixed(2)}`;

  localStorage.setItem("carrito", JSON.stringify(carrito));

  // 🔥 **Solución: Detener la propagación del evento al hacer clic en "Eliminar"**
  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // ⚠️ Esto evita que el evento se propague al panel
      const index = e.target.getAttribute('data-index');
      carrito.splice(index, 1);
      actualizarCarrito();
    });
  });

  // Actualizar contador de ítems (burbuja flotante)
  const contadorElem = document.getElementById('contadorCarrito');
  if (contadorElem) contadorElem.textContent = carrito.length;
}

function renderizarProductos(lista) {
  const contenedor = document.querySelector(".productos");
  const titulo = document.querySelector(".contenido h2");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h4>${p.nombre}</h4>
      <p>${p.volumen}</p>
      <p>S/ ${p.precio.toFixed(2)}</p>
    `;
    const boton = document.createElement("button");
    boton.textContent = "Agregar";
    boton.addEventListener("click", () => {
      carrito.push({ nombre: p.nombre, volumen: p.volumen, precio: p.precio, img: p.img });
      actualizarCarrito();
    });
    card.appendChild(boton);
    contenedor.appendChild(card);
  });

  if (titulo) {
    if (lista === gaseosas) titulo.textContent = "GASEOSAS";
    else if (lista === snacks) titulo.textContent = "SNACKS";
    else if (lista === postres) titulo.textContent = "POSTRES";
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (categoria === "snacks") renderizarProductos(snacks);
  else if (categoria === "postres") renderizarProductos(postres);
  else renderizarProductos(gaseosas); // por defecto

  // Menú lateral dinámico
  const aside = document.querySelector("aside ul");
  if (aside) {
    aside.innerHTML = `
      <li>Bebidas</li>
      <li>Snacks</li>
      <li>Postres</li>
    `;
  }

  document.querySelectorAll("aside ul li").forEach(li => {
    li.addEventListener("click", () => {
      const categoria = li.textContent.trim().toLowerCase();
      if (categoria === "snacks") renderizarProductos(snacks);
      else if (categoria === "postres") renderizarProductos(postres);
      else if (categoria === "bebidas") renderizarProductos(gaseosas);
    });
  });

  actualizarCarrito();

  // ===================== BURBUJA FLOTANTE ANIMADA =====================
  const burbuja = document.getElementById('burbujaCarrito');
  const panel = document.getElementById('panelCarrito');

  if (burbuja && panel) {
    // Mostrar u ocultar con clase
    burbuja.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });

    // Cerrar si haces clic fuera del panel (excepto en botón Agregar)
    document.addEventListener('click', (e) => {
      const esAgregar = e.target.tagName === 'BUTTON' && e.target.textContent.trim() === 'Agregar';
      if (
        panel.classList.contains('visible') &&
        !panel.contains(e.target) &&
        !burbuja.contains(e.target) &&
        !esAgregar
      ) {
        panel.classList.remove('visible');
      }
    });
  }
});
