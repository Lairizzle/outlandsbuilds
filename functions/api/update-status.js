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
  const status = formData.get("status");

  const allowedStatuses = ["pending", "approved", "rejected"];
  if (!id || !allowedStatuses.includes(status)) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await env.DB.prepare(
    "UPDATE submissions SET status = ? WHERE id = ?"
  ).bind(status, id).run();

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
