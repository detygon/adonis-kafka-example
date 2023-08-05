import DefaultConsumer from 'App/Services/DefaultConsumer'

const consumers = [new DefaultConsumer()]

consumers.forEach((consumer) => {
  consumer.startConsumer({ fromBeginning: consumer.fromBeginning })
})
