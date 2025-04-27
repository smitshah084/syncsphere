import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  // Validate required parameters
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 },
    );
  }

  if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 },
    );
  }

  // Verify environment configuration
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured - check LiveKit environment variables" },
      { status: 500 },
    );
  }

  try {
    // Create access token with expiration
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: "6h", // Token expiration (6 hours)
    });

    // Add room permissions
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    // Generate JWT (using synchronous version for compatibility)
    const token =await at.toJwt(); // or await at.toJwt() if using async

    return NextResponse.json({ token });

  } catch (error) {
    console.error("Token generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 },
    );
  }
}
