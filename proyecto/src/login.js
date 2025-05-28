import { supabase } from './supabase.js';

export function showLogin(app) {
  app.innerHTML = `
    <form id="form-login">
      <h2>Iniciar sesión</h2>
      <input type="email" id="email-login" placeholder="Correo" required>
      <input type="password" id="password-login" placeholder="Contraseña" required>
      <button type="submit">Entrar</button>
    </form>
  `;

  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
    } else {
      alert('Sesión iniciada');
      import('./main.js').then(mod => mod.loadView('catalogo'));
    }
  });
}
