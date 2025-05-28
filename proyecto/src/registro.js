import { supabase } from './supabase.js';

export async function registrarUsuario(email, password, nombre, telefono, direccion) {
  // 1. Crear cuenta en auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert('Error al registrar: ' + error.message);
    return;
  }

  const userId = data.user.id;

  // 2. Insertar datos adicionales
  const { error: insertError } = await supabase
    .from('usuarios')
    .insert([
      {
        id: userId,
        email,
        nombre,
        telefono,
        direccion,
      },
    ]);

  if (insertError) {
    alert('Usuario creado, pero error al guardar datos: ' + insertError.message);
  } else {
    alert('¡Usuario registrado correctamente!');
  }
}