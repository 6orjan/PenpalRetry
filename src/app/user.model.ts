
export interface Message {
    to?: string;
    from?: string;
    content: string;
    timestamp: string;
  }
  
  export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    country: string;
    interests: string[];
    messageSent: Message[];
    messageReceived: Message[];
  }