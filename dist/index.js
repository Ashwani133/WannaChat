"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        var _a;
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            //find currentUser room
            let currentUserRoom = null;
            currentUserRoom = (_a = allSockets.find((s) => s.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            //send message to all the members in the room
            allSockets.forEach((s) => {
                if (s.room === currentUserRoom) {
                    s.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
});
