import { supabase } from './supabase.js';
import { loadView } from './main.js';

export function showLogin(app) {
  app.innerHTML = `
    <form id="form-login">
      <h2>Iniciar Sesión</h2>
      <input type="email" id="email-login" required placeholder="Correo">
      <input type="password" id="password-login" required placeholder="Contraseña">
      <button type="submit">Entrar</button>
      <p>¿No tienes cuenta? <a id="link-registro" href="#">Regístrate aquí</a></p>
    </form>
  `;

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      loadView('catalogo');
    }
  });

  document.getElementById('link-registro').addEventListener('click', (e) => {
    e.preventDefault();
    loadView('registro');
  });
}
