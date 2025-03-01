import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdpage=async({params}:MemberIdPageProps)=>{

    const profile=await currentProfile();

    if (!profile) return <RedirectToSignIn />;
    const {serverId,memberId}=await params;
    const currentMember=await db.member.findFirst({
        where:{
            serverId:serverId,
            profileId:profile.id
        },
        include:{
            profile:true
        }
    });

    if (!currentMember) return redirect("/");

    const conversation=await getOrCreateConversation(currentMember.id,memberId);

    if (!conversation) {
        return redirect(`/servers/${serverId}/`);
    }
    const {memberOne,memberTwo}=conversation;
    const otherMember = (memberOne.profileId=== profile.id) ? memberTwo : memberOne;
return(<div className="bg-white dark:bg-[#313338] flex flex-col h-full">

<ChatHeader
imageUrl={otherMember.profile.imageUrl}
name={otherMember.profile.name}
serverId={serverId}
type="conversation"
></ChatHeader>

  </div>
)
}

export default MemberIdpage;
