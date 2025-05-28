import { supabase } from './supabase.js';

export async function mostrarProductos(app) {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    app.innerHTML = `<p>Error cargando productos.</p>`;
    return;
  }

  app.innerHTML = '<div class="contenedor-productos"></div>';
  const contenedor = document.querySelector('.contenedor-productos');

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `
      <img src="${producto.imagen_url}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button>Agregar</button>
    `;
    contenedor.appendChild(card);
  });
}
