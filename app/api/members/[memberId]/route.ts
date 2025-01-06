import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
        req: Request,
        { params } :{ params : { memberId:string } }
      ) {
      
        try {
          const profile = await currentProfile();
      
          const { searchParams } = new URL(req.url);
          const serverId = searchParams.get("serverId");
      
          if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
          }
      
          if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
          }
      
          if (!params.memberId) {
                return new NextResponse("Member ID missing", { status: 400 });
              }
              
        const server = await db.server.update({
        where: {
                id: serverId,
                profileId: profile.id,
        },
        data: {
                members: {
                deleteMany: {
                id: params.memberId,
                profileId: {
                not: profile.id
                }
                }
        }
        },
        include: {
                members: {
                  include: {
                    profile: true,
                  },
                  orderBy: {
                    role: "asc",
                  },
                },
              },
        });

        return NextResponse.json(server);
        
        } catch (error) {
          console.log("[MEMBER_ID_DELETE]", error);
          return new NextResponse("Internal Error", { status: 500 });
        }
      }

export async function PATCH(req: Request, context: { params: { memberId: string } }) {
  try {
    const profile = await currentProfile();
    const searchParams = new URLSearchParams(new URL(req.url).search);
    const { role } = await req.json(); // Destructure role from the request body
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const params = await context.params; // Await the context.params object
    if (!params?.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[MEMBERS_ID_PATCH]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
