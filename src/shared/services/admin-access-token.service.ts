import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';

const TOKENS_FILE = path.resolve(__dirname, '../../../admin-access-tokens.json');
const MIN_TOKENS = 10;

export class AdminAccessTokenService {
  private tokens: Set<string> = new Set();
  private loaded = false;

  async init() {
    await this.loadTokens();
    if (this.tokens.size < MIN_TOKENS) {
      await this.generateTokens(MIN_TOKENS - this.tokens.size);
    }
  }

  private async loadTokens() {
    try {
      const data = await fs.readFile(TOKENS_FILE, 'utf-8');
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        this.tokens = new Set(arr);
      }
      this.loaded = true;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        // Arquivo não existe, criar novo
        await this.saveTokens();
        this.loaded = true;
      } else {
        throw err;
      }
    }
  }

  private async saveTokens() {
    await fs.writeFile(TOKENS_FILE, JSON.stringify(Array.from(this.tokens), null, 2), 'utf-8');
  }

  private async generateTokens(qty: number) {
    for (let i = 0; i < qty; i++) {
      this.tokens.add(this.generateToken());
    }
    await this.saveTokens();
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async validateAndConsume(token: string): Promise<boolean> {
    if (!this.loaded) await this.init();
    if (this.tokens.has(token)) {
      this.tokens.delete(token);
      await this.saveTokens();
      // Garante que sempre haja pelo menos MIN_TOKENS
      if (this.tokens.size < MIN_TOKENS) {
        await this.generateTokens(MIN_TOKENS - this.tokens.size);
      }
      return true;
    }
    return false;
  }

  async getTokens(): Promise<string[]> {
    if (!this.loaded) await this.init();
    return Array.from(this.tokens);
  }
} 