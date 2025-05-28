import { supabase } from './supabase.js';

export async function mostrarCarrito(app) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    app.innerHTML = '<p>Debes iniciar sesión para ver el carrito.</p>';
    return;
  }

  const userId = session.user.id;

  const { data: items, error } = await supabase
    .from('carrito')
    .select('id, cantidad, productos(nombre, precio, imagen_url)')
    .eq('user_id', userId);

  if (error || !items) {
    app.innerHTML = '<p>Error al cargar el carrito.</p>';
    return;
  }

  if (items.length === 0) {
    app.innerHTML = `
      <h2>Mi Carrito</h2>
      <p>Tu carrito está vacío.</p>
      <button onclick="loadView('catalogo')">Volver al catálogo</button>
    `;
    return;
  }

  let total = 0;
  items.forEach(item => {
    total += item.cantidad * item.productos.precio;
  });

  app.innerHTML = `
    <h2>Mi Carrito</h2>
    <section class="contenedor-productos"></section>
    <div class="total-carrito">Total: $${total.toFixed(2)}</div>
    <button id="btn-confirmar" class="confirmar-compra">✅ Confirmar compra</button>
    <footer class="temu-menu">
      <button onclick="loadView('catalogo')">🏠 Inicio</button>
      <button onclick="loadView('favoritos')">❤️ Favoritos</button>
      <button onclick="loadView('perfil')">👤 Tú</button>
      <button onclick="loadView('carrito')">🛒 Carrito</button>
    </footer>
  `;

  const contenedor = app.querySelector('.contenedor-productos');

  items.forEach(item => {
    const { productos: producto, cantidad, id: itemId } = item;

    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `
      <img src="${producto.imagen_url}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio} x ${cantidad}</p>

      <div class="cantidad-control">
        <button class="btn-disminuir" data-id="${itemId}">➖</button>
        <span>${cantidad}</span>
        <button class="btn-aumentar" data-id="${itemId}">➕</button>
      </div>

      <button class="btn-eliminar" data-id="${itemId}">🗑️ Eliminar</button>
    `;
    contenedor.appendChild(card);
  });

  // Eliminar producto
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      await supabase.from('carrito').delete().eq('id', id);
      mostrarCarrito(app);
    });
  });

  // Aumentar cantidad
  document.querySelectorAll('.btn-aumentar').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      await supabase.rpc('incrementar_cantidad', { item_id: parseInt(id) });
      mostrarCarrito(app);
    });
  });

  // Disminuir cantidad
  document.querySelectorAll('.btn-disminuir').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      await supabase.rpc('disminuir_cantidad', { item_id: parseInt(id) });
      mostrarCarrito(app);
    });
  });

  // Confirmar compra
  document.getElementById('btn-confirmar').addEventListener('click', async () => {
    const { error } = await supabase.from('carrito').delete().eq('user_id', userId);
    if (error) {
      alert('Ocurrió un error al confirmar la compra.');
      return;
    }

    app.innerHTML = `
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido procesado correctamente.</p>
      <button id="volver">Volver al catálogo</button>
    `;

    document.getElementById('volver').addEventListener('click', () => {
      import('./main.js').then(m => m.loadView('catalogo'));
    });
  });
}
