import { supabase } from './supabase.js';
import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos } from './productos.js';
import { mostrarCarrito } from './carrito.js';

export async function loadView(view) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (view === 'login') {
    hideNavbar();
    showLogin(app);
  }
  else if (view === 'registro') {
    hideNavbar();
    showRegistro(app);
  }
  else if (view === 'catalogo') {
    showNavbar();
    mostrarProductos(app);
  }
  else if (view === 'carrito') {
    showNavbar();
    mostrarCarrito(app);
  }
}

function showNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'flex';
}

function hideNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'none';
}

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

  // Botón para ir al catálogo
  const btnCatalogo = document.getElementById('btn-catalogo');
  if (btnCatalogo) {
    btnCatalogo.addEventListener('click', () => loadView('catalogo'));
  }

  // Botón para ir al carrito (si lo usas en el footer)
  const btnCarrito = document.getElementById('btn-carrito');
  if (btnCarrito) {
    btnCarrito.addEventListener('click', () => loadView('carrito'));
  }

  // Verifica si hay sesión activa
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    loadView('catalogo');
  } else {
    loadView('login');
  }
});
