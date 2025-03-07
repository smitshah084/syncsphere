import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as SocketIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";
import exp from "constants";

export const config ={
    api :{
        bodyParser: false
    },

}

const iohandler = (req: NextApiRequest, res: NextApiResponseServerIo ) => {
    if (!res.socket.server.io) {
        const path  = "api/socket/io";
        const httpServer:NetServer =res.socket.server as any;
        const io=new SocketIO(httpServer,{path:path,
            addTrailingSlash:false,
        });
        res.socket.server.io=io;
    }

};

export default iohandler;
