import { LLMRestClient } from '../src';
import type { LLMConfig } from '../src/types';

export type { LLMConfig };

export class TestMCPClient {
  private client: LLMRestClient;

  constructor(config: LLMConfig) {
    this.client = new LLMRestClient(config);
  }

  async connect() {
    return this.client.connect();
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async processUserQuery(query: string) {
    return this.client.processUserQuery(query);
  }

  async readResource(uri: string) {
    return this.client.readResource(uri);
  }

  async callTool(name: string) {
    return this.client.callTool(name);
  }
}
