import * as express from "express";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as  cors from "cors";
import { Server as WSServer} from 'ws';
//@ts-ignore
import StompServer from 'stomp-broker-js/stompServer';

https.globalAgent.options.rejectUnauthorized = false;

function getApp(response: string) {
  const app = express();
  app.use(cors());
  app.get('/', (req, res) => {
    console.log('GET request at HTTP server');
    res.send(response);
  });
  return app;
}

export function runHttpServer(port: number): Promise<http.Server> {
  return new Promise(resolve => {
    const server = http.createServer(getApp('hello http!'));
    server.listen(port, () => {
      console.log(`HTTP server listening at http://localhost:${port}`);
      resolve(server);
    });
  });
}

export function runHttpsServer(port: number): Promise<https.Server> {
  const key = fs.readFileSync(path.join(__dirname, 'cert', 'test.key'), 'utf-8');
  const cert = fs.readFileSync(path.join(__dirname, 'cert', 'test.crt'), 'utf-8');
  return new Promise(resolve => {
    const server = https.createServer({ key, cert }, getApp('hello https!'));
    server.listen(port, () => {
      console.log(`HTTPS server listening at http://localhost:${port}`);
      resolve(server);
    });
  });
}

export function runWsServer(port: number) {
  const wss = new WSServer({
    port,
    perMessageDeflate: false
  });
  wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
      if (message === 'close') {
        ws.close();
      }
    });
    ws.send('server confirms connection');
  });
  return wss;
}
