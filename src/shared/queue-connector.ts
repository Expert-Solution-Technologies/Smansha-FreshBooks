import amqp, { Channel, Connection } from 'amqplib';
import logger from '@shared/logger';
import app from '@server';
import { ConnectionType } from 'src/enums/common-enums';
import { MQueueData } from 'src/interfaces-and-types';

export class QueueConnector {

  /**
   * Channel for sender Queue should be defined once
   */
  private static senderQueueChannel: Channel;

  /**
   * Conection Url for rabbit MQ
   */
  private static ConnUrl: string = process.env.RABBITQUEUE_URL || '';

  /**
   * Options passed such as credentials
   */
  private static opt: any = {
    credentials: amqp.credentials.plain(
      process.env.RABBITQUEUE_USER_NAME || '',
      process.env.RABBITQUEUE_USER_PASS || ''
    )
  };

  /**
   * will create connection with rabbit mq server
   */
  public static async createConnection(): Promise<amqp.Connection> {
    try {
      // creating connection to Rabbit MQ
      return await amqp.connect(this.ConnUrl, this.opt);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * will return the connection based on connection Type
   * @param connectionType pass the connection Type for getting the connection
   */
  public static async getQueueConnection(connectionType: ConnectionType): Promise<amqp.Connection> {
    try {
      // check connection if exist in global variable
      let conn: amqp.Connection = app.get(connectionType);
      // If not exist then Get channel connection
      if (!conn) {
        conn = await this.createConnection();
        app.set(connectionType, conn);
      }
      return conn;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * Recieve message from Queue
   * @param queueName pass the queue name
   */
  public static async recieveMessageFromQueue(queueName: string) {
    try {
      // Get chhanel connection if not exist
      const conn: amqp.Connection = await QueueConnector.getQueueConnection(ConnectionType.reciever);
      const ch: amqp.Channel = await conn.createChannel();
      ch.assertQueue(queueName, {
        durable: true
      });
      // get one message at a time
      ch.prefetch(1);
      // queue message consumer
      ch.consume(queueName, async (msg: any) => {
        try {
          // loading json data from the queue and converting it into json format
          const queueData = JSON.parse(msg.content.toString());
        } catch (err) {
          logger.error(err);
        }
        // ack message after processing
        ch.ack(msg);
      }, {
        noAck: false
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  /**
   * add message data to queue
   * @param queueName pass the queue name
   * @param data pass the data
   */
  static async sendMessageToQueue(queueName: string, data: MQueueData) {
    try {
      // Check channel exist or not. If not then create it from connection again.
      if (!this.senderQueueChannel) {
        // Get sender connection
        const conn: Connection = await QueueConnector.getQueueConnection(ConnectionType.sender);
        // Create new channel
        this.senderQueueChannel = await conn.createChannel();
      }

      this.senderQueueChannel.assertQueue(queueName, {
        durable: true
      });

      // send message data to queue
      this.senderQueueChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (err) {
      logger.error(err.message || err.stack);
      throw err;
    }
  }
}
