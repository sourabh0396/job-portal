import { log } from "console";
import { Kafka } from "kafkajs";
import nodemailer from "nodemailer"
export const startSendMailConsumer = async () => {
    try {
        const kafka = new Kafka({
            // clientId: 'my-app',
            clientId: 'mail-service',

            brokers: [process.env.kafka_Broker || 'localhost:9092' || 'kafka1:9092', 'kafka2:9092'],
        })

        const consumer = kafka.consumer({ groupId: 'mail-service-group' })
        await consumer.connect()

        const topicName = 'send-mail'
        await consumer.subscribe({ topic: topicName, fromBeginning: false })
        console.log('✅ Mail service consumer started,listening for sending mail');
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { to, subject, html } = JSON.parse(
                        message.value?.toString() || "{}"
                    );

                    const transporter = nodemailer.createTransport({
                        // host: "smtp.gmail",
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                            // user: 'xyz',
                            // pass: 'yzx',
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
                        },
                    })

                    await transporter.sendMail({
                        from: "HireJob <no-reply>",
                        to,
                        subject,
                        html
                    })
                    console.log(`Mail has been send to ${to}`);

                } catch (error) {
                    console.log('Failed to send Mail', error);

                }
            }
        })


    } catch (error) {
        console.log('❌Failed to start Kafka consumer', error);

    }
}