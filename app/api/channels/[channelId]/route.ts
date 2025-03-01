import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  context: { params?: { channelId?: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!context.params || !context.params?.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channelId = context.params?.channelId;

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params?: { channelId?: string } }
) {
  try {
    const profile = await currentProfile();
    const body = await req.json();
    console.log("Backend - Received request body:", body);
    console.log("Backend - Channel ID:", context.params?.channelId);

    const { name, type } = body;

    if (!profile) {
      console.log("Backend - No profile found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    console.log("Backend - Server ID from query:", serverId);

    if (!serverId) {
      console.log("Backend - Missing server ID");
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!context.params?.channelId) {
      console.log("Backend - Missing channel ID");
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      console.log("Backend - Attempted to name channel 'general'");
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    console.log("Backend - Updating channel with data:", {
      name,
      type,
      channelId: context.params?.channelId,
      serverId
    });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: context.params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
      include: {
        channels: true,
      },
    });

    console.log("Backend - Updated server response:", server);
    return NextResponse.json(server);
  } catch (error) {
    console.error("Backend - Error details:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
