import { NextResponse } from "next/server";
import { Resend } from "resend";

// Force this route to be evaluated at request time, not at build/collect time.
// (Without this, Next 16 may try to instantiate the module during page-data
// collection, which fails when RESEND_API_KEY isn't present.)
export const dynamic = "force-dynamic";

export async function POST(req) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, subject, message } = body ?? {};
  if (!email || !subject || !message) {
    return NextResponse.json(
      { error: "Missing one of: email, subject, message." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [fromEmail, email],
      subject,
      react: (
        <>
          <h1>{subject}</h1>
          <p>Thank you for contacting me!</p>
          <p>Your message was submitted:</p>
          <p>{message}</p>
        </>
      ),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message ?? "Unknown email error." },
      { status: 500 }
    );
  }
}
