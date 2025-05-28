import { supabase } from './supabase.js';

export function showRegistro(app) {
  app.innerHTML = `
    <form id="form-registro">
      <h2>Registro</h2>
      <input type="text" id="nombre" placeholder="Nombre completo" required>
      <input type="text" id="telefono" placeholder="Teléfono" required>
      <input type="text" id="direccion" placeholder="Dirección" required>
      <input type="email" id="email" placeholder="Correo" required>
      <input type="password" id="password" placeholder="Contraseña" required>
      <button type="submit">Registrarse</button>
    </form>
  `;

  document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Error al registrar: ' + error.message);
      return;
    }

    const userId = data.user.id;
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert([{ id: userId, email, nombre, telefono, direccion }]);

    if (insertError) {
      alert('Usuario creado, pero error al guardar datos: ' + insertError.message);
    } else {
      alert('¡Registro exitoso!');
      import('./main.js').then(mod => mod.loadView('login'));
    }
  });
}
