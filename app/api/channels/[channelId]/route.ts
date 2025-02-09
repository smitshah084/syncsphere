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

    if (!context.params || !context.params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channelId = context.params.channelId;

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
          const {name,type} = await  req.json()
          if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
      
          const { searchParams } = new URL(req.url);
          const serverId = searchParams.get("serverId");
      
          if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
          }
      
          if (!context.params || !context.params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
          }

          if (name === "general"){
                return new NextResponse("name can not be general", { status: 400 });
          }
      
          const channelId = context.params.channelId;
      
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
                      id: channelId,
                      NOT: {
                        name: "general",
                      },
                    },
                    data:{
                        name,
                        type,
                    }
                  },
                },
              }
          });
      
          return NextResponse.json(server);
        } catch (error) {
          console.error("[CHANNEL_ID_PATCH]", error);
          return new NextResponse("Internal Error", { status: 500 });
        }
      }