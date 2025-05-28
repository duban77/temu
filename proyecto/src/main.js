import { supabase } from './supabase.js';
import { showLogin } from './login.js';
import { showRegistro } from './registro.js';
import { mostrarProductos, mostrarFavoritos } from './productos.js';
import { mostrarCarrito } from './carrito.js';
import { mostrarPerfil } from './perfil.js';
import { mostrarAdmin } from './admin.js'; // ✅ Vista admin

// 👉 Función para cambiar de vista
export async function loadView(view) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  switch (view) {
    case 'login':
      hideNavbar();
      showLogin(app);
      break;
    case 'registro':
      hideNavbar();
      showRegistro(app);
      break;
    case 'catalogo':
      showNavbar();
      mostrarProductos(app);
      break;
    case 'carrito':
      showNavbar();
      mostrarCarrito(app);
      break;
    case 'favoritos':
      showNavbar();
      mostrarFavoritos(app);
      break;
    case 'perfil':
      showNavbar();
      mostrarPerfil(app);
      break;
    case 'admin':
      showNavbar();
      mostrarAdmin(app);
      break;
    default:
      app.innerHTML = '<p>Vista no encontrada.</p>';
  }
}

// 👉 Hacer la función accesible globalmente
window.loadView = loadView;

// 👉 Mostrar/Ocultar barra de navegación
function showNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'flex';
}

function hideNavbar() {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.style.display = 'none';
}

// 👉 Iniciar la app cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', async () => {
  // Botones del navbar
  const navbarButtons = {
    'btn-logout': async () => {
      await supabase.auth.signOut();
      alert('Sesión cerrada');
      loadView('login');
    },
    'btn-catalogo': () => loadView('catalogo'),
    'btn-carrito': () => loadView('carrito'),
    'btn-favoritos': () => loadView('favoritos'),
    'btn-perfil': () => loadView('perfil'),
    'btn-admin': () => loadView('admin'),
  };

  // Asignar eventos a botones si existen
  for (const [id, handler] of Object.entries(navbarButtons)) {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', handler);
  }

  // Verificar sesión actual
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
