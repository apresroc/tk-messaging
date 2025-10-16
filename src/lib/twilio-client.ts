// Twilio client that uses the server-side API endpoint
// This ensures Twilio credentials stay secure on the server

export class TwilioClient {
  private isInitialized: boolean = false;

  initialize(accountSid: string, authToken: string, fromNumber: string) {
    // Store credentials for validation (not used for actual API calls)
    this.isInitialized = true;
    console.log('Twilio client initialized with:', { accountSid, fromNumber });
  }

  async sendMessage(to: string, body: string, mediaUrl?: string[]) {
    try {
      console.log('Sending message via API:', { to, body, mediaUrl });
      
      const response = await fetch('/api/twilio/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, body, mediaUrl }),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          messageId: result.messageId,
          status: result.status
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || 'Failed to send message'
        };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async getMessages(to: string) {
    // For now, return mock messages since we don't have a get messages API yet
    console.log('Fetching messages for:', to);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock messages
    return [
      {
        id: `MM${Math.random().toString(36).substr(2, 9)}`,
        body: 'Hello! This is a sample message.',
        direction: 'inbound',
        timestamp: new Date(),
        status: 'delivered'
      }
    ];
  }
}

export const twilioClient = new TwilioClient();