import { createClient } from 'redis';
import config from '.'

const client = createClient({
    password: config.general.REDIS_PASSWORD,
    socket: {
        host: config.general.REDIS_HOST,
        port: config.general.REDIS_PORT
    }
});

client.on("connect", () => {
    console.log("Connected to Redis");
});

client.connect();

client.on("error", (error) => {
    console.error("Redis error:", error);
});


export default client