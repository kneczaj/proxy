import { runHttpServer, runHttpsServer, runWsServer } from "./server";
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
  it('passes Websocket', async () => {
    const server = runWsServer(4002);
    const ws = new WebSocket(`ws://${HOST}:${WS_PORT}`);
    await new Promise<void>(resolve => {
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
        server.close();
        resolve();
      });
    });
  });
});
