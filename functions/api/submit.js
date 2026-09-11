export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();

  // Verify Turnstile token first
  const turnstileToken = formData.get("cf-turnstile-response");
  const ip = request.headers.get("CF-Connecting-IP");

  const verifyResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: ip,
      }),
    }
  );

  const verifyResult = await verifyResponse.json();

  if (!verifyResult.success) {
    return new Response("Verification failed. Please try again.", { status: 403 });
  }

  // Existing logic continues as before
  const name = formData.get("name");
  const email = formData.get("email") || null;
  const build_name = formData.get("build_name");
  const writeup = formData.get("writeup");
  const csv_filename = formData.get("csv_filename") || null;
  const csv_content = formData.get("csv_content") || null;

  if (!name || !build_name || !writeup) {
    return new Response("Missing required fields", { status: 400 });
  }

  const MAX_LENGTHS = {
    name: 200,
    email: 200,
    build_name: 200,
    writeup: 5000,
    csv_filename: 200,
    csv_content: 50000,
  };

  if (name.length > MAX_LENGTHS.name) {
    return new Response("Name too long", { status: 400 });
  }
  if (email && email.length > MAX_LENGTHS.email) {
    return new Response("Email too long", { status: 400 });
  }
  if (build_name.length > MAX_LENGTHS.build_name) {
    return new Response("Build name too long", { status: 400 });
  }
  if (writeup.length > MAX_LENGTHS.writeup) {
    return new Response("Writeup too long (max 5000 characters)", { status: 400 });
  }
  if (csv_filename && csv_filename.length > MAX_LENGTHS.csv_filename) {
    return new Response("CSV filename too long", { status: 400 });
  }
  if (csv_content && csv_content.length > MAX_LENGTHS.csv_content) {
    return new Response("CSV content too long (max 50,000 characters)", { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO submissions (name, email, build_name, writeup, csv_filename, csv_content)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(name, email, build_name, writeup, csv_filename, csv_content).run();

  return Response.redirect(new URL("/thank-you/", request.url), 303);
}
