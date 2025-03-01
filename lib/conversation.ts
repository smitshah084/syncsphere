import { db } from "./db"

export const getOrCreateConversation=async (memberOneId:string,memberTwoId:string)=>{
    let converstaion=await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId);
    if(!converstaion){
        converstaion=await createNewConversation(memberOneId,memberTwoId);
    }

    return converstaion;
}

const findConversation=async (memberOneId:string,memberTwoId:string)=>{

   try {
    return await db.converstaion.findFirst({
        where:{
            AND:[{ memberOneId:memberOneId},{memberTwoId:memberTwoId}]
        },
        include:{
            memberOne :{
                include:{
                    profile:true
                }
            },
            memberTwo :{
                include:{
                    profile:true
                }
            }
        }
    });
   } catch (error) {
    return null;
   }

}

const createNewConversation=async (memberOneId:string,memberTwoId:string)=>{
    try {
        return await db.converstaion.create({
            data:{
                memberOneId,
                memberTwoId
            },
            include:{
                memberOne :{
                    include:{
                        profile:true
                    }
                },
                memberTwo :{
                    include:{
                        profile:true
                    }
                }
            }
        })
    } catch (error) {
        return null;
    }
}
