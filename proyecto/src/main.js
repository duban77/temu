import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos } from './productos.js';

export function loadView(view) {
  const app = document.getElementById('app');
  app.innerHTML = ''; // limpia vista actual

  if (view === 'login') showLogin(app);
  else if (view === 'registro') showRegistro(app);
  else if (view === 'catalogo') mostrarProductos(app);
}

// Por defecto mostrar el login al cargar la app
loadView('login');
