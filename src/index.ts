import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket:WebSocket,
    room:string
}

let allSockets:User[] = [];

wss.on("connection",(socket)=>{
    socket.on("message",(message)=>{
        //@ts-ignore
        const parsedMessage = JSON.parse(message)
        if(parsedMessage.type==="join"){
            allSockets.push({
                socket,
                room:parsedMessage.payload.roomId
            })
        }

        if(parsedMessage.type === "chat"){
            //find currentUser room
            let currentUserRoom = null;
            currentUserRoom = allSockets.find((s) => s.socket === socket)?.room

            //send message to all the members in the room
            allSockets.forEach((s)=>{
                if(s.room === currentUserRoom){
                    s.socket.send(parsedMessage.payload.message);
                }
            })
        }
    })
})