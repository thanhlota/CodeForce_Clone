const { createClient } = require('redis');

class Redis {
  static instance = null;
  client = null;

  async init() {
    this.client = await createClient({
      url: process.env.REDIS_URI
    })
      .on('error', err => console.log('Redis Client Error', err))
      .on('ready', () => console.log("REDIS CONNECTED SUCCESSFULLY!"))
      .on('end', () => console.log("CLOSE REDIS CONNECTION SUCCESSFULLY"))
      .connect();
  }
  setClient(client) {
    this.client = client;
  }

  getClient() {
    return this.client;
  }
  async getValue() {
    const value = await client.get('key');
    return value;
  }

  async setValue() {
    await this.client.set('key', 'value');
  }

  async disconnect() {
    await this.client.disconnect();
    this.setClient(null);
  }

  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }
}

module.exports = Redis;