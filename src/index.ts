import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let allSockets:WebSocket[] = [];
let userCount = 0;

wss.on("connection",(socket)=>{
    allSockets.push(socket)
    console.log("user connected #",userCount);

    socket.on("message",(message)=>{
        console.log("message received", message.toString())
        allSockets.forEach(s => {
            s.send(message.toString() + ": sent from the server")
        })
    })

    socket.on("disconnect",()=>{
        allSockets.filter(x => x != socket)
    })
})