import { KafkaMessage } from 'kafkajs'
import AbstractBaseConsumer from './AbstractBaseConsumer'
import axios from 'axios'
import { consumers } from 'Config/kafka'

export default class DefaultConsumer extends AbstractBaseConsumer {
  public fromBeginning: boolean = true

  protected getTopic(): string {
    return consumers.default.topic
  }

  protected getBrokers(): string {
    return consumers.default.brokers
  }

  protected getGroupId(): string {
    return consumers.default.groupId
  }

  protected getClientId(): string {
    return consumers.default.clientId
  }

  protected getConfig(): any {
    return consumers.default.extraConfig
  }

  protected handleMessage(message: KafkaMessage): void {
    const data = JSON.parse(message.value?.toString() || '')
    console.log(data)
    axios.post('https://webhook.site/8959f08f-2d3d-46ef-b9fe-4882bc6ef431', data)
  }
}
