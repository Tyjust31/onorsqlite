import db from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
  const { pseudo, password } = await request.json();

  const user = db.prepare('SELECT * FROM users WHERE pseudo = ? AND password = ?')
                 .get(pseudo, password);

  if (user) {
    // On met un cookie
    cookies.set('session_pseudo', pseudo, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 jour
    });

    
    return json({ success: true, message: 'Connexion réussie !' });
  } else {
    return json({ success: false, message: 'Utilisateur inconnu ou mot de passe incorrect.' });
  }
}
