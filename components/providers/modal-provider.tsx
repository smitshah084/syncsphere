"use client";

import {CreateServerModal} from "@/components/models/create-server-modal";
import {useEffect, useState} from "react" ;
import { InviteModal } from "../models/invite-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    if(!isMounted) {
        return null;
    }

    return (

        <div>
            <CreateServerModal />
            <InviteModal/>
        </div>
    );

}
