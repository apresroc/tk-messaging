import twilio from 'twilio';

export class TwilioClient {
  private client: twilio.Twilio | null = null;
  private fromNumber: string = '';

  initialize(accountSid: string, authToken: string, fromNumber: string) {
    this.client = twilio(accountSid, authToken);
    this.fromNumber = fromNumber;
  }

  async sendMessage(to: string, body: string) {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const message = await this.client.messages.create({
        body,
        from: this.fromNumber,
        to
      });
      
      return {
        success: true,
        messageId: message.sid,
        status: message.status
      };
    } catch (error) {
      console.error('Twilio send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getMessages(to: string) {
    if (!this.client) {
      throw new Error('Twilio client not initialized');
    }

    try {
      const messages = await this.client.messages.list({
        to,
        from: this.fromNumber,
        limit: 50
      });

      return messages.map(msg => ({
        id: msg.sid,
        body: msg.body,
        direction: msg.direction as 'inbound' | 'outbound',
        timestamp: new Date(msg.dateCreated || new Date()),
        status: msg.status as 'sent' | 'delivered' | 'failed'
      }));
    } catch (error) {
      console.error('Twilio fetch error:', error);
      return [];
    }
  }
}

export const twilioClient = new TwilioClient();