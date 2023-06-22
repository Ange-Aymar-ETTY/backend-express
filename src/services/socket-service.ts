import { Server, Socket } from "socket.io";

export class SocketService {
    static server: Server;

    static bind(io: Server) {
        this.server = io;

        io.on('connection', (socket: Socket) => {
            socket.handshake.secure = true;

            socket.on('handshake', ({ key }) => {
                // console.log(`User Identifiant : ${key}`);
                socket.join(key);
            });

            // socket.on('disconnect', () => {
            //     console.log(`A Customer has Disconnect`);
            // });
        });
    }

    static emitTo(room: string, eventName: string, data: any) {
        if (this.server) {
            this.server.to(room).emit(eventName, { data });
        }
    }

    static checkRoomExists(room: string) {
        return this.server.sockets.adapter.rooms.has(room);
    }
}