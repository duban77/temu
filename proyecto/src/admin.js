import { supabase } from './supabase.js';

export async function mostrarAdmin(app) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    app.innerHTML = '<p>Debes iniciar sesión como administrador.</p>';
    return;
  }

  const { data: userData } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', session.user.id)
    .single();

  if (!userData || userData.rol !== 'admin') {
    app.innerHTML = '<p>Acceso denegado: no eres administrador.</p>';
    return;
  }

  const { data: productos, error } = await supabase
    .from('productos')
    .select('*');

  if (error) {
    app.innerHTML = '<p>Error cargando productos.</p>';
    return;
  }

  app.innerHTML = `
    <h2>Panel Administrativo</h2>
    <form id="form-agregar" class="form-admin">
      <input type="text" id="nombre" placeholder="Nombre del producto" required>
      <input type="number" id="precio" placeholder="Precio" required>
      <input type="text" id="imagen_url" placeholder="URL de la imagen" required>
      <button type="submit">Agregar Producto</button>
    </form>

    <div class="productos-admin">
      ${productos.map(prod => `
        <div class="producto-admin">
          <img src="${prod.imagen_url}" alt="${prod.nombre}">
          <div class="info">
            <h3>${prod.nombre}</h3>
            <p>$${prod.precio.toLocaleString()}</p>
            <div class="acciones">
              <button onclick="editarProducto(${prod.id})">Editar</button>
              <button onclick="eliminarProducto(${prod.id})">Eliminar</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Agregar nuevo producto
  document.getElementById('form-agregar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen_url = document.getElementById('imagen_url').value;

    const { error } = await supabase.from('productos').insert([{ nombre, precio, imagen_url }]);
    if (error) return alert('Error al agregar');

    alert('Producto agregado');
    location.reload();
  });
}

// Funciones globales
window.eliminarProducto = async function (id) {
  const { error } = await supabase.from('productos').delete().eq('id', id);
  if (error) return alert('Error al eliminar');
  alert('Producto eliminado');
  location.reload();
};

window.editarProducto = async function (id) {
  const nuevoNombre = prompt('Nuevo nombre:');
  const nuevoPrecio = parseFloat(prompt('Nuevo precio:'));
  const nuevaImagen = prompt('Nueva URL de imagen:');

  if (!nuevoNombre || !nuevoPrecio || !nuevaImagen) return;

  const { error } = await supabase.from('productos')
    .update({ nombre: nuevoNombre, precio: nuevoPrecio, imagen_url: nuevaImagen })
    .eq('id', id);

  if (error) return alert('Error al editar');
  alert('Producto actualizado');
  location.reload();
};
