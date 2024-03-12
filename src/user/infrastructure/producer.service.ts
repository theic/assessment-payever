import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../constants';

@Injectable()
export class ProducerService {
  constructor(@Inject(Constants.RABBITMQ_SERVICE_NAME) private client: ClientProxy) {}

  async sendMessage(topic: string, message: string) {
    try {
      await this.client.connect();
      this.client.emit(topic, message);
    } catch (err) {
      console.log('Error sending message', err);
    }
  }
}
