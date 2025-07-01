import db from '$lib/db.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  const { pseudo, password } = await request.json();

  try {
    db.prepare('INSERT INTO users (pseudo, password) VALUES (?, ?)').run(pseudo, password);
    return json({ success: true, message: 'Inscription réussie !' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return json({ success: false, message: 'Ce pseudo est déjà pris.' });
    }
    return json({ success: false, message: 'Erreur serveur.' });
  }
}
