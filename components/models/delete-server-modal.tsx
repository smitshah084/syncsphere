"use client";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import axios from "axios";

import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";


export const DeleteServerModal = () => {

    const {openModal,isOpen, closeModal, type,data} = useModal();
    const router=useRouter();

    const {server} =data;
    const isModalOpen = isOpen && type === "deleteServer";


    const [isloading , setIsLoading] = useState(false);

    const onClick = async () => {
        try{
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            closeModal();
            router.refresh();
            router.push("/");

        }
        catch(err){
            console.log(err);
        }
        finally{
            setIsLoading(false);
        }
    }





        return (
                <Dialog open={isModalOpen} onOpenChange={closeModal} >
                        <DialogContent className="bg-white dark:text-neutral-400 p-0 overflow-hidden">
                                <DialogHeader className="pt-8 px-6">
                                        <DialogTitle className="text-2xl text-center font-bold">
                                             Delete Server
                                        </DialogTitle>

                                        <DialogDescription className="text-center text-zinc-500 text-xl gap-2">
                                                Are you sure you want to do this? <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permeneantly deleted.
                                        </DialogDescription>


                                </DialogHeader>
                                <DialogFooter className="bg-gray-100 px-6 py-4">
                                <div
                                className="flex item-center justify-between w-full">
                                    <Button
                                    disabled={isloading}
                                    onClick={()=>closeModal()}
                                    variant={"ghost"}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                     disabled={isloading}
                                     onClick={onClick}
                                     variant={"primary"}>
                                        Confirm
                                    </Button>
                                </div>
                                </DialogFooter>


                        </DialogContent>
                </Dialog>
        );
};
