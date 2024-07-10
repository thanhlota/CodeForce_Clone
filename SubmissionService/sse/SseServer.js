class SseServer {
    static clients = [];
    static instance = null;

    establishConnection(client) {
        const res = client.response;
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        res.on('close', () => {
            console.log(`Connection has been removed by client: ${client.id}`);
        })
        SseServer.clients.push(client);
        console.log(`Client: ${client.id} established connection successfully!`);
    }

    sendEvent(submissionId, verdict, time, memory) {
        if (!submissionId) {
            console.log("Missing submission id!");
            return;
        }

        if (!verdict) {
            console.log("Missing verdict!");
            return;
        }

        if (!time) {
            console.log("Missing time!");
            return;
        }

        if (!memory) {
            console.log("Missing memory!");
            return;
        }

        for (let i = 0; i < SseServer.clients.length; i++) {
            const client = SseServer.clients[i];
            const id = Date.now();
            if (client.submission_ids.includes(submissionId)) {
                client.response.write(`id: ${id}\n`);
                client.response.write(`data: ${JSON.stringify({
                    submissionId,
                    verdict,
                    time,
                    memory
                })}\n\n`);
                client.submission_ids = client.submission_ids.filter((id) => id != submissionId);
                if (client.submission_ids.length == 0) {
                    SseServer.closeConnection(client.id);
                }
            }
        }
    }

    static sendDisconnectEvent(client) {
        client.response.write(`data: ${JSON.stringify({
            type: "disconnect"
        })}\n\n`)
    }

    static closeConnection(clientId) {
        for (let i = 0; i < SseServer.clients.length; i++) {
            const client = SseServer.clients[i];
            if (client.id === clientId) {
                SseServer.sendDisconnectEvent(client);
                setTimeout(() => {
                    client.response.end();
                    console.log(`Connection with client: ${client.id} has been removed by server!`)
                }, 5000);
                break;
            }
        }
        SseServer.clients = SseServer.clients.filter(client => client.id !== clientId);
    }

    static getInstance() {
        if (!SseServer.instance) {
            SseServer.instance = new SseServer();
        }
        return SseServer.instance;
    }
}


module.exports = SseServer;