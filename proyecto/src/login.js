import { supabase } from './supabase.js';

export async function iniciarSesion(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert('Error al iniciar sesión: ' + error.message);
  } else {
    alert('¡Sesión iniciada!');
    // Aquí puedes redirigir o mostrar productos
  }
}
