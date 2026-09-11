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

  const id = formData.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await env.DB.prepare("DELETE FROM submissions WHERE id = ?").bind(id).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
