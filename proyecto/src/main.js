import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos } from './productos.js';

export function loadView(view) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (view === 'login') showLogin(app);
  else if (view === 'registro') showRegistro(app);
  else if (view === 'catalogo') mostrarProductos(app);
}

// Asegúrate de que los botones existen antes de asignar eventos
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-login').addEventListener('click', () => loadView('login'));
  document.getElementById('btn-registro').addEventListener('click', () => loadView('registro'));
  document.getElementById('btn-catalogo').addEventListener('click', () => loadView('catalogo'));

  // Cargar login por defecto
  loadView('login');
});
