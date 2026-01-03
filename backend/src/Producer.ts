import { log } from "console";
import { Kafka, Producer, Admin } from "kafkajs";
import dotenv from 'dotenv';
dotenv.config()
let produccer: Producer;
let admin: Admin;

export const connectKafka = async () => {
    try {
        const kafka = new Kafka({
            clientId: 'auth-service',
            brokers: [process.env.kafka_Broker_Auth || 'localhost:9092'],
        })

        admin = kafka.admin();
        await admin.connect();

        const topics = await admin.listTopics();
        if (!topics.includes("send-mail")) {
            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1,
                    },
                ],
            });
            console.log('📧 Topic "sen-mail" created');

        }
        await admin.disconnect();
        produccer = kafka.producer();
        await produccer.connect();
        console.log('✅ conntected to kafka producer');

    } catch (error) {
        console.log('❌ Failed to connect kafka', error);

    }
}


export const publishTOTopic = async (topic: string, message: any) => {
    if (!produccer) {
        console.log('Kafka producer us not initialized');
        return;
    }
    try {
        await produccer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(message)
                },
            ],
        });

    } catch (error) {
        console.log('❌ Failed to publish message to kafka', error);

    }
};


export const disconnectKafka = async () => {
    if (produccer) {
        produccer.disconnect();
    }
};