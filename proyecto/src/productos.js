import { supabase } from './supabase.js';

export async function mostrarProductos() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    console.error('Error al cargar productos:', error.message);
    return;
  }

  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

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
