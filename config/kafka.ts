import Env from '@ioc:Adonis/Core/Env'

interface ConsumerConfig {
  [key: string]: {
    clientId: string
    brokers: string
    groupId: string
    topic: string
    extraConfig: {
      ssl?: {
        rejectUnauthorized: boolean
      }
      sasl?: {
        mechanism: string
        username: string
        password: string
      }
    }
  }
}

export const consumers: ConsumerConfig = {
  default: {
    clientId: Env.get('KAFKA_CLIENT_ID'),
    brokers: Env.get('KAFKA_BROKERS'),
    groupId: Env.get('KAFKA_GROUP_ID'),
    topic: Env.get('KAFKA_TOPIC'),
    extraConfig: {
      ssl: {
        rejectUnauthorized: true,
      },
      sasl: {
        mechanism: Env.get('KAFKA_SASL_MECHANISM'),
        username: Env.get('KAFKA_SASL_USERNAME'),
        password: Env.get('KAFKA_SASL_PASSWORD'),
      },
    },
  },
}
