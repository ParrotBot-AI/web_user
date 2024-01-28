class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private autoReconnectInterval: number; // 重连间隔时间（毫秒）

  constructor(url: string, autoReconnectInterval = 5000) {
    this.url = url;
    this.autoReconnectInterval = autoReconnectInterval;
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected.");
      // 连接打开的相关处理
    };

    this.ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      // 收到消息的处理
    };

    this.ws.onclose = (event) => {
      switch (event.code) {
        case 1000: // 正常关闭
          console.log("WebSocket closed.");
          break;
        default: // 非正常关闭
          this.reconnect();
          break;
      }
      // 连接关闭的处理
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.ws?.close();
    };
  }

  private reconnect(): void {
    setTimeout(() => {
      console.log("WebSocket attempting to reconnect...");
      this.connect();
    }, this.autoReconnectInterval);
  }

  public sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close(1000); // 1000 是一个正常关闭的状态码
    }
  }
}

export default WebSocketClient;