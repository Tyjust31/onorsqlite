export async function POST({ cookies }) {
  cookies.delete('session_pseudo', { path: '/' });
  return new Response(null, { status: 204 });
}
