import { IncomingMessage, Server, ServerResponse } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./cors";

class SocketIO {
	private io?: SocketIOServer;

	public initialize(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
		this.io = new SocketIOServer(server, {
			cors: corsConfig,
		});
	}

	public getIO() {
		if (!this.io) {
			throw new Error("Socket.io instance not initialized");
		}
		return this.io;
	}

	public registerEvents() {
		const io = this.getIO();

		io.on("connection", (socket) => {
			const id = socket.handshake.query.id as string;

			socket.join(id);

			socket.on("disconnect", () => {
				socket.leave(id);
			});
		});
	}
}

export const socketIO = new SocketIO();
