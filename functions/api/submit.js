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

  await env.DB.prepare(
    `INSERT INTO submissions (name, email, build_name, writeup, csv_filename, csv_content)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(name, email, build_name, writeup, csv_filename, csv_content).run();

  return Response.redirect(new URL("/thank-you/", request.url), 303);
}
