export class WebSocketService {
    private ws: WebSocket | null = null;
    private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  
    connect(symbol: string) {
      this.ws = new WebSocket(`wss://your-websocket-url/${symbol}`);
      this.ws.onmessage = this.handleMessage.bind(this);
    }
  
    private handleMessage(event: MessageEvent) {
      const data = JSON.parse(event.data);
      const subscribers = this.subscribers.get(data.type) || [];
      subscribers.forEach(callback => callback(data));
    }
  
    subscribe(type: string, callback: (data: any) => void) {
      const subscribers = this.subscribers.get(type) || [];
      this.subscribers.set(type, [...subscribers, callback]);
    }
  
    unsubscribe(type: string, callback: (data: any) => void) {
      const subscribers = this.subscribers.get(type) || [];
      this.subscribers.set(type, subscribers.filter(cb => cb !== callback));
    }
  }