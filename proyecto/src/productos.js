import { supabase } from './supabase.js';

export async function mostrarProductos(app) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    app.innerHTML = '<p>Debes iniciar sesión para ver los productos.</p>';
    return;
  }

  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error || !productos) {
    app.innerHTML = `<p>Error cargando productos.</p>`;
    return;
  }

  app.innerHTML = `
    <header class="temu-header">
      <h1 class="logo">Temu</h1>
      <input type="text" placeholder="Buscar..." class="search-box" />
    </header>

    <section class="contenedor-productos"></section>

    <footer class="menu-inferior">
      <button onclick="import('./main.js').then(m => m.loadView('catalogo'))">🏠</button>
      <button onclick="alert('Favoritos próximamente')">❤️</button>
      <button id="btn-ir-carrito">🛒</button>
      <button onclick="alert('Perfil próximamente')">👤</button>
    </footer>
  `;

  const contenedor = document.querySelector('.contenedor-productos');

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `
      <img src="${producto.imagen_url}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button class="btn-agregar" data-id="${producto.id}">Agregar</button>
    `;
    contenedor.appendChild(card);
  });

  // Agregar evento a todos los botones de agregar
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const userId = session.user.id;

      const { error } = await supabase.from('carrito').insert([
        {
          user_id: userId,
          product_id: productId,
          cantidad: 1
        }
      ]);

      if (error) {
        alert('Error al agregar al carrito');
        console.error(error);
      } else {
        alert('Producto agregado al carrito');
      }
    });
  });

  // Evento para ir al carrito
  document.getElementById('btn-ir-carrito').addEventListener('click', () => {
    import('./main.js').then(mod => mod.loadView('carrito'));
  });
}
