import amqp from "amqplib";
import { CONFIG } from "../config";

const RBQ_URL = "amqp://" + CONFIG.RMQ_USERNAME + ":" + CONFIG.RMQ_PASWWORD + "@" + CONFIG.RMQ_HOST;

export const sendIncomingMessage = (queue: string, data: any) => {
    return new Promise<any>((resolve, reject) => {
        amqp.connect(RBQ_URL)
            .then(connection => {
                connection.createChannel().then(channel => {
                    channel.assertQueue(queue, { durable: true })
                        .then(() => {
                            const msg = JSON.stringify(data);
                            const sended = channel.sendToQueue(
                                queue,
                                Buffer.from(msg),
                                {
                                    persistent: true
                                }
                            );
                            resolve(sended);

                            setTimeout(() => connection.close(), 500);
                        });
                });
            })
            .catch(() => reject(false));
    });
}
