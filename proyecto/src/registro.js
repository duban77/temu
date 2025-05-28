import { supabase } from './supabase.js';
import { loadView } from './main.js';

export function showRegistro(app) {
  app.innerHTML = `
    <form id="form-registro">
      <h2>Registro</h2>
      <input type="text" id="nombre" placeholder="Nombre completo" required>
      <input type="text" id="telefono" placeholder="Teléfono" required>
      <input type="text" id="direccion" placeholder="Dirección" required>
      <input type="email" id="email" placeholder="Correo" required>
      <input type="password" id="password" placeholder="Contraseña" required>

      <select id="rol" required>
        <option value="">Selecciona tu rol</option>
        <option value="usuario">Usuario</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit">Registrarse</button>
      <p>¿Ya tienes cuenta? <a id="link-login" href="#">Inicia sesión</a></p>
    </form>
  `;

  document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const rol = document.getElementById('rol').value;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Error al registrar: ' + error.message);
      return;
    }

    const userId = data.user.id;
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ id: userId, email, nombre, telefono, direccion, rol }]);

    if (insertError) {
      alert('Error al guardar el perfil: ' + insertError.message);
    } else {
      alert('¡Registrado! Ahora inicia sesión.');
      loadView('login');
    }
  });

  document.getElementById('link-login').addEventListener('click', (e) => {
    e.preventDefault();
    loadView('login');
  });
}
