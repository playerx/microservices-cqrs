import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'reflect-metadata'
import { RabbitMQQueue } from './core/queue/rabbitmq.queue'
import { NotificationModule } from './example/notification'
import { PortalModule } from './example/portal'
import { UserModule } from './example/user'

const amqpConnectionString = 'amqp://guest:guest@localhost:5672'

const userQueue = new RabbitMQQueue({
  name: 'User',
  amqpConnectionString,
  newId: () => Date.now().toString(),
  publishExchangeName: 'HubExchange',
})

const notificationQueue = new RabbitMQQueue({
  name: 'Notification',
  amqpConnectionString,
  newId: () => Date.now().toString(),
  publishExchangeName: 'HubExchange',
})

const portalQueue = new RabbitMQQueue({
  name: 'Portal',
  amqpConnectionString,
  newId: () => Date.now().toString(),
  publishExchangeName: 'HubExchange',
})

@Module({
  imports: [
    UserModule.forRoot({ queue: userQueue }),
    NotificationModule.forRoot({ queue: notificationQueue }),
    PortalModule.forRoot({ queue: portalQueue }),
  ],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
}

bootstrap()
