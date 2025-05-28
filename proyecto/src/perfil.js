import { supabase } from './supabase.js';
import { loadView } from './main.js';

export async function mostrarPerfil(app) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    app.innerHTML = '<p>Debes iniciar sesión para ver tu perfil.</p>';
    return;
  }

  const { user } = session;

  // Obtener datos adicionales de la tabla usuarios
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('nombre, telefono, direccion')
    .eq('id', user.id)
    .single();

  if (error || !usuario) {
    app.innerHTML = '<p>Error al cargar los datos del perfil.</p>';
    return;
  }

  app.innerHTML = `
    <section class="perfil">
      <h2>Mi Perfil</h2>
      <form id="form-perfil">
        <label>Nombre completo</label>
        <input type="text" id="nombre" value="${usuario.nombre || ''}" required>

        <label>Teléfono</label>
        <input type="text" id="telefono" value="${usuario.telefono || ''}" required>

        <label>Dirección</label>
        <input type="text" id="direccion" value="${usuario.direccion || ''}" required>

        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Cuenta creada:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>

        <button type="submit">Guardar Cambios</button>
        <button type="button" id="btn-eliminar-cuenta" style="background: crimson; color: white;">Eliminar cuenta</button>
      </form>

      <button id="btn-logout-perfil">Cerrar Sesión</button>
    </section>

    <footer class="temu-menu">
      <button onclick="loadView('catalogo')"><span class="emoji">🏠</span><span class="texto">Inicio</span></button>
      <button onclick="loadView('favoritos')"><span class="emoji">❤️</span><span class="texto">Favoritos</span></button>
      <button onclick="loadView('perfil')"><span class="emoji">👤</span><span class="texto">Tú</span></button>
      <button onclick="loadView('carrito')"><span class="emoji">🛒</span><span class="texto">Carrito</span></button>
    </footer>
  `;

  // Guardar cambios del perfil
  document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;

    const { error } = await supabase.from('usuarios').update({
      nombre,
      telefono,
      direccion
    }).eq('id', user.id);

    if (error) {
      alert('Error al actualizar perfil.');
    } else {
      alert('Perfil actualizado correctamente.');
    }
  });

  // Eliminar cuenta
  document.getElementById('btn-eliminar-cuenta').addEventListener('click', async () => {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmar) {
      await supabase.from('usuarios').delete().eq('id', user.id);
      await supabase.auth.signOut();
      alert('Cuenta eliminada.');
      loadView('registro');
    }
  });

  // Cerrar sesión
  document.getElementById('btn-logout-perfil').addEventListener('click', async () => {
    await supabase.auth.signOut();
    alert('Sesión cerrada');
    loadView('login');
  });
}
