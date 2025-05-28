import { supabase } from './supabase.js';
import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos, mostrarFavoritos } from './productos.js';
import { mostrarCarrito } from './carrito.js';
import { mostrarPerfil } from './perfil.js';
import { mostrarAdmin } from './admin.js'; // ✅ Vista admin

// 👉 Exporta la función globalmente para usarla desde botones con onclick
export async function loadView(view) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (view === 'login') {
    hideNavbar();
    showLogin(app);
  } else if (view === 'registro') {
    hideNavbar();
    showRegistro(app);
  } else if (view === 'catalogo') {
    showNavbar();
    mostrarProductos(app);
  } else if (view === 'carrito') {
    showNavbar();
    mostrarCarrito(app);
  } else if (view === 'favoritos') {
    showNavbar();
    mostrarFavoritos(app);
  } else if (view === 'perfil') {
    showNavbar();
    mostrarPerfil(app);
  } else if (view === 'admin') {
    showNavbar();
    mostrarAdmin(app); // ✅ Panel de administrador
  }
}

// 👉 Hacer la función accesible globalmente (para usarla con onclick)
window.loadView = loadView;

function showNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'flex';
}

function hideNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'none';
}

// 👉 Al iniciar la aplicación
window.addEventListener('DOMContentLoaded', async () => {
  // Botón de logout
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await supabase.auth.signOut();
      alert('Sesión cerrada');
      loadView('login');
    });
  }

  // Botón para catálogo
  const btnCatalogo = document.getElementById('btn-catalogo');
  if (btnCatalogo) {
    btnCatalogo.addEventListener('click', () => loadView('catalogo'));
  }

  // Botón para carrito
  const btnCarrito = document.getElementById('btn-carrito');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', () => loadView('carrito'));
  }

  // Botón para favoritos
  const btnFavoritos = document.getElementById('btn-favoritos');
  if (btnFavoritos) {
    btnFavoritos.addEventListener('click', () => loadView('favoritos'));
  }

  // Botón para perfil
  const btnPerfil = document.getElementById('btn-perfil');
  if (btnPerfil) {
    btnPerfil.addEventListener('click', () => loadView('perfil'));
  }

  // Botón para vista admin (opcional si lo tienes visible)
  const btnAdmin = document.getElementById('btn-admin');
  if (btnAdmin) {
    btnAdmin.addEventListener('click', () => loadView('admin'));
  }

  // Verifica sesión activa y redirige
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { data: perfil } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single();

    if (perfil?.rol === 'admin') {
      loadView('admin');
    } else {
      loadView('catalogo');
    }
  } else {
    loadView('login');
  }
});
