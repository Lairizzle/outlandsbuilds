export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();

  const password = formData.get("password");

  if (password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { results } = await env.DB.prepare(
    "SELECT * FROM submissions ORDER BY created_at DESC"
  ).all();

  return new Response(JSON.stringify({ submissions: results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
