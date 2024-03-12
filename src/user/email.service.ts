import { Injectable } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class EmailService {
  async sendWelcomeEmail(user: any) {
    console.log(`Sending welcome email to ${user.email}`);
  }

  @MessagePattern('user_created')
  async handleUserCreated(@Payload() data: any) {
    console.log('Received user_created event:', data);
    await this.sendWelcomeEmail(data);
  }
}
