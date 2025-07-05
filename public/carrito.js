document.addEventListener("DOMContentLoaded", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const resumenLista = document.getElementById("lista-productos");
  const cantidad = document.getElementById("cantidad");
  const subcantidad = document.getElementById("subcantidad");
  const subtotalElem = document.getElementById("subtotal");
  const impuestosElem = document.getElementById("impuestos");
  const totalElem = document.getElementById("total");

  if (!resumenLista) return;

  resumenLista.innerHTML = "";

  let total = 0;
  let contador = 0;

  carrito.forEach(item => {
    if (item && typeof item.precio === "number") {
      const contenedor = document.createElement("div");
      contenedor.classList.add("item");
      contenedor.innerHTML = `
        <img src="${item.img}" alt="${item.nombre}">
        <div class="item-details">
          <h4>${item.nombre}</h4>
          <p>${item.volumen}</p>
          <p><strong>Precio:</strong> S/ ${item.precio.toFixed(2)}</p>
        </div>
      `;
      resumenLista.appendChild(contenedor);
      total += item.precio;
      contador++;
    }
  });

  // Cálculo IGV correcto: total ya incluye IGV, por eso sacamos el subtotal así:
  const subtotal = total / 1.18;
  const igv = total - subtotal;

  if (cantidad) cantidad.textContent = contador;
  if (subcantidad) subcantidad.textContent = `${contador} producto${contador === 1 ? '' : 's'}`;
  if (subtotalElem) subtotalElem.textContent = `S/ ${subtotal.toFixed(2)}`;
  if (impuestosElem) impuestosElem.textContent = `S/ ${igv.toFixed(2)}`;
  if (totalElem) totalElem.textContent = `S/ ${total.toFixed(2)}`;
});
