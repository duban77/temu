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

  const { data: favoritos } = await supabase
    .from('favoritos')
    .select('product_id')
    .eq('user_id', session.user.id);

  const idsFavoritos = favoritos ? favoritos.map(f => f.product_id) : [];

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

    <footer class="temu-menu">
      <button onclick="import('./main.js').then(m => m.loadView('catalogo'))">
        <span class="emoji">🏠</span>
        <span class="texto">Inicio</span>
      </button>
      <button onclick="import('./main.js').then(m => m.loadView('favoritos'))">
        <span class="emoji">❤️</span>
        <span class="texto">Favoritos</span>
      </button>
      <button onclick="alert('Perfil próximamente')">
        <span class="emoji">👤</span>
        <span class="texto">Tú</span>
      </button>
      <button id="btn-ir-carrito">
        <span class="emoji">🛒</span>
        <span class="texto">Carrito</span>
        <span class="contador" id="contador-carrito" style="display: none;">0</span>
      </button>
    </footer>
  `;

  const contenedor = document.querySelector('.contenedor-productos');
  let listaCompleta = productos;
  renderizarProductos(listaCompleta, contenedor, session.user.id, idsFavoritos);

  const buscador = document.querySelector('.search-box');
  buscador.addEventListener('input', () => {
    const texto = buscador.value.toLowerCase();
    const filtrados = listaCompleta.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
    renderizarProductos(filtrados, contenedor, session.user.id, idsFavoritos);
  });

  document.getElementById('btn-ir-carrito').addEventListener('click', () => {
    import('./main.js').then(mod => mod.loadView('carrito'));
  });

  updateContador(session.user.id);
}

function renderizarProductos(lista, contenedor, userId, favoritos) {
  contenedor.innerHTML = '';
  lista.forEach(producto => {
    const esFavorito = favoritos.includes(producto.id);
    const card = document.createElement('div');
    card.className = 'card-producto';
    card.innerHTML = `
      <img src="${producto.imagen_url}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio}</p>
      <div class="acciones-producto">
        <button class="btn-agregar" data-id="${producto.id}">🛒</button>
        <button class="btn-favorito" data-id="${producto.id}">${esFavorito ? '❤️' : '🤍'}</button>
      </div>
    `;
    contenedor.appendChild(card);
  });

  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
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
        updateContador(userId);
      }
    });
  });

  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const productId = parseInt(e.target.getAttribute('data-id'));
      const yaFav = favoritos.includes(productId);

      if (yaFav) {
        await supabase.from('favoritos')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        e.target.textContent = '🤍';
        favoritos.splice(favoritos.indexOf(productId), 1);
      } else {
        await supabase.from('favoritos').insert([
          { user_id: userId, product_id: productId }
        ]);
        e.target.textContent = '❤️';
        favoritos.push(productId);
      }
    });
  });
}

async function updateContador(userId) {
  const { data: items } = await supabase
    .from('carrito')
    .select('id')
    .eq('user_id', userId);

  const contador = document.getElementById('contador-carrito');
  if (items && items.length > 0) {
    contador.textContent = items.length;
    contador.style.display = 'block';
  } else {
    contador.style.display = 'none';
  }
}
