import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,
    {params}:{params:{serverId:string}}
) {
    try {
        const profile = await currentProfile();
        const {serverId}=params;
        if(!profile) {
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!serverId) {
            return new NextResponse("Missing ServerId",{status:400});
        }
        const server=await db.server.update({
            where:{
                id:params.serverId,
                profileId : {
                    not:profile.id
                },
                members:{
                    some:{
                        profileId:profile.id,

                }
            }
            },

            data:{
                members:{
                    deleteMany:{

                            profileId:profile.id

                    }
                }
            }
        });
        return  NextResponse.json(server);
    } catch (error) {
        console.log("server_leave",error);
        return new NextResponse("Internal error",{status:500});
    }
}
