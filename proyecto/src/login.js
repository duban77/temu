import { supabase } from './supabase.js';
import { loadView } from './main.js';

export function showLogin(app) {
  app.innerHTML = `
    <form id="form-login">
      <h2>Iniciar Sesión</h2>
      <input type="email" id="email" placeholder="Correo" required>
      <input type="password" id="password" placeholder="Contraseña" required>
      <button type="submit">Entrar</button>
      <p>¿No tienes cuenta? <a id="link-registro" href="#">Regístrate</a></p>
    </form>
  `;

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      return;
    }

    const userId = data.user.id;

    // Obtener datos del usuario desde la tabla 'usuarios'
    const { data: perfil, error: errorPerfil } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', userId)
      .single();

    if (errorPerfil) {
      alert('No se pudo obtener el perfil del usuario');
      return;
    }

    if (perfil.rol === 'admin') {
      alert('Bienvenido Administrador');
      loadView('admin'); // Cambia a la vista de admin
    } else {
      alert('Bienvenido Usuario');
      loadView('catalogo');
    }
  });

  document.getElementById('link-registro').addEventListener('click', (e) => {
    e.preventDefault();
    loadView('registro');
  });
}
