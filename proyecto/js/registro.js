import { supabase } from '../src/supabase.js';

export async function registrarUsuario(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert('Error al registrar: ' + error.message);
  } else {
    alert('¡Registrado correctamente!');
  }
}
