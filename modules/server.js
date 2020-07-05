
// Server Module
// Creates an HTTP server for a parent process and sends messages upward
// - Layla

const debug = true;

// Task class, for keeping requests organized

const tasks = new Map();

class Task extends require("events") {
    constructor(data) {
        super();
        this.id = Task.genCode(16);
        this.data = data;
        this.then = null;

        setTimeout(() => {
            this.emit("destroy");
        }, 1000 * 60 * 5);
    }

    static genCode(t) {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let str = "";
        while(str.length < t)
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        return str;
    }
}

// Setup Server

const net = require("net");

let Socket = null;

function listener(data) {
    data = data.toString();

    if (debug) {
        console.log("received data");
        console.log(data);
    }

    let json = JSON.parse(data);
    json["ip"] = Socket.remoteAddress.replace(/::ffff:/, ""); //Attach IP to Request obj

    let task = new Task(json);
    task.then = reply => {
        if (Socket) {
            Socket.write(JSON.stringify(reply.data));
        } else {
            console.error(`Task ${task.id} completed with no socket to reply to.`);
        }
        task.emit("destroy");
    };
    task.on("destroy", () => tasks.delete(task.id));
    tasks.set(task.id, task);

    process.send({id: task.id, data: task.data});
}

process.on("message", (reply) => {
    if (tasks.has(reply.id))
        tasks.get(reply.id).then(reply);
});

function kill(sock) {
    try {
        sock.end();
    } catch (e) {
        console.error("error killing socket");
        console.error(e);
    }
}

const server = net.createServer(socket => {
    console.log("Connection received.");
    if (!socket) {
        console.log("Dead socket, aborting");
        return;
    } else if (!socket.remoteAddress) {
        console.log("Broken socket, killing");
        kill(socket);
        return;
    } else if (Socket) {
        // Already have an established connection
        console.log("Existing Socket already found.");
        if (Socket.remoteAddress !== socket.remoteAddress) {
            kill(socket);
            return;
        }
        console.log("Same remote address, replacing");
    }

    socket.on("data", listener);

    socket.on("close", () => {
        Socket = null;
        console.log("Socket Closed, free to accept a new socket");
    });

    Socket = socket;
    console.log("Socket established");
});

server.on("error", err => {
    throw err;
});

server.listen(8000);
console.log("TCP server listening on port 8000");
