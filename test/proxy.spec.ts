import { runHttpServer, runHttpsServer } from "./server";
import axios from "axios";
import * as https from "https";

const HOST = 'localhost.fakedomain.com';
const HTTP_PORT = 4000;
const HTTPS_PORT = 4001;

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
});
