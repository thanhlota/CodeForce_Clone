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
            console.log("Connection has been removed by client!");
            res.end();
        })
        clients.push(client);
        console.log(`Client: ${client.id} established connection successfully!`);
    }

    sentEvent(submissionId, verdict) {
        if (!submissionId) {
            console.log("Missing submission id!");
            return;
        }

        if (!verdict) {
            console.log("Missing verdict!");
            return;
        }

        for (let i = 0; i < SseServer.clients.length; i++) {
            const client = SseServer.clients[i];
            const id = Date.now();
            if (client.submissionIds.includes(submissionId)) {
                client.response.write(`id: ${id}\n`);
                client.response.write(`data: ${JSON.stringify(verdict)}\n\n`);
                client.submissionIds = client.submissionIds.filter((id) => id != submissionId);
                if (client.submissionIds.length == 0) {
                    SseServer.closeConnection(client.id);
                }
            }
        }
    }

    static sendDisconnectEvent(clientId) {

    }

    static closeConnection(clientId) {
        for (let i = 0; i < SseServer.clients.length; i++) {
            const client = SseServer.clients[i];
            if (client.id === clientId) {
                // SseServer.sendDisconnectEvent(clientId);
                // setTimeout(() => {
                //     client.response.end();
                // }, 10000);
                client.response.end();
                break;
            }
        }
        clients = clients.filter(client => client.id !== clientId);
    }

    static getInstance() {
        if (!SseServer.instance) {
            SseServer.instance = new SseServer();
        }
        return SseServer.instance;
    }
}
