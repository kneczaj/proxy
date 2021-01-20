import { runHttpServer, runHttpsServer, runWsServer, runWssServer } from "./server";
import axios from "axios";
import * as https from "https";
import * as WebSocket from 'ws';

const HOST = 'localhost.fakedomain.com';
const HTTP_PORT = 4000;
const HTTPS_PORT = 4001;
const WS_PORT = 4002;
const WSS_PORT = 4003;

describe('Proxy', () => {
  it('passes HTTP', async () => {
    const server = await runHttpServer(HTTP_PORT);
    try {
      const response = await axios.get(`http://${HOST}:${HTTP_PORT}`);
      expect(response.data).toEqual('hello http!');
    } finally {
      server.close();
    }
  });
  it('passes HTTPS', async () => {
    const server = await runHttpsServer(HTTPS_PORT);
    const agent = new https.Agent({
      rejectUnauthorized: false
    });
    try {
      const response = await axios.get(`https://${HOST}:${HTTPS_PORT}`, { httpsAgent: agent });
      expect(response.data).toEqual('hello https!');
    } finally {
      server.close();
    }
  });

  function testWebsocket(ws: WebSocket) {
    return new Promise<string>(resolve => {
      ws.on('open', function open() {
        console.log(`Client: opened`);
        ws.send('message');
      });

      ws.on('message', function incoming(data) {
        console.log(`Client: ${data}`);
        if (data === 'server confirms connection') {
          ws.send('close');
        }
      });

      ws.on('close', () => {
        resolve('success');
      });
    });
  }

  it('passes Websocket', async () => {
    const server = runWsServer(WS_PORT);
    const ws = new WebSocket(`ws://${HOST}:${WS_PORT}`);
    const result = await testWebsocket(ws);
    server.close();
    expect(result).toBe('success');
  });
  it('passes Websocket over HTTPS', async () => {
    const { server, wss } = await runWssServer(WSS_PORT);
    const ws = new WebSocket(`wss://${HOST}:${WSS_PORT}`);
    const result = await testWebsocket(ws);
    wss.close();
    server.close();
    expect(result).toBe('success');
  });
});
