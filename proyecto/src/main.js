import { supabase } from './supabase.js';
import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos } from './productos.js';

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
}

function showNavbar() {
  document.getElementById('navbar').style.display = 'flex';
}
function hideNavbar() {
  document.getElementById('navbar').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', async () => {
  // Maneja botón cerrar sesión
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    alert('Sesión cerrada');
    loadView('login');
  });

  document.getElementById('btn-catalogo').addEventListener('click', () => loadView('catalogo'));

  // Verifica si hay sesión activa
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    loadView('catalogo');
  } else {
    loadView('login');
  }
});
