export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email") || null;
  const build_name = formData.get("build_name");
  const writeup = formData.get("writeup");
  const csv_filename = formData.get("csv_filename") || null;
  const csv_content = formData.get("csv_content") || null;

  if (!name || !build_name || !writeup) {
    return new Response("Missing required fields", { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO submissions (name, email, build_name, writeup, csv_filename, csv_content)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(name, email, build_name, writeup, csv_filename, csv_content).run();

  return Response.redirect(new URL("/thank-you/", request.url), 303);
}
