import { supabase } from './supabase.js';

export async function mostrarPerfil(app) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    app.innerHTML = '<p>Debes iniciar sesión para ver tu perfil.</p>';
    return;
  }

  const { user } = session;

  app.innerHTML = `
    <section class="perfil">
      <h2>Mi Perfil</h2>
      <div class="perfil-info">
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>ID de Usuario:</strong> ${user.id}</p>
        <p><strong>Creado el:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      <button id="btn-logout-perfil">Cerrar Sesión</button>
    </section>

    <footer class="temu-menu">
      <button onclick="loadView('catalogo')">
        <span class="emoji">🏠</span>
        <span class="texto">Inicio</span>
      </button>
      <button onclick="loadView('favoritos')">
        <span class="emoji">❤️</span>
        <span class="texto">Favoritos</span>
      </button>
      <button onclick="loadView('perfil')">
        <span class="emoji">👤</span>
        <span class="texto">Tú</span>
      </button>
      <button onclick="loadView('carrito')">
        <span class="emoji">🛒</span>
        <span class="texto">Carrito</span>
      </button>
    </footer>
  `;

  // Logout desde perfil
  document.getElementById('btn-logout-perfil').addEventListener('click', async () => {
    await supabase.auth.signOut();
    alert('Sesión cerrada');
    loadView('login');
  });
}
