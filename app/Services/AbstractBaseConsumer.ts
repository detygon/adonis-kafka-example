import Logger from '@ioc:Adonis/Core/Logger'
import {
  Consumer,
  ConsumerSubscribeTopics,
  EachBatchPayload,
  Kafka,
  EachMessagePayload,
  KafkaMessage,
} from 'kafkajs'

export default abstract class AbstractBaseConsumer {
  private kafkaConsumer: Consumer
  public abstract fromBeginning: boolean

  constructor() {
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  public async startConsumer({ fromBeginning = true }): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.getTopic()],
      fromBeginning,
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload
          this.handleMessage(message)
        },
      })
    } catch (error) {
      Logger.error(error)
    }
  }

  public async startBatchConsumer({ fromBeginning = true }): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: [this.getTopic()],
      fromBeginning,
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload
          for (const message of batch.messages) {
            this.handleMessage(message)
          }
        },
      })
    } catch (error) {
      Logger.error(error)
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  protected abstract getTopic(): string

  protected abstract getGroupId(): string

  protected abstract getBrokers(): string

  protected abstract getClientId(): string

  protected abstract getConfig(): any

  protected abstract handleMessage(message: KafkaMessage): void

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: this.getClientId(),
      brokers: [this.getBrokers()],
      ...this.getConfig(),
    })

    const consumer = kafka.consumer({ groupId: this.getGroupId() })

    return consumer
  }
}
