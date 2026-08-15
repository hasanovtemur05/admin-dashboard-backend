import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private host: string;
  private apiKey: string;

  constructor(host: string, apiKey: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async indexExists(indexName: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/indexes/${indexName}`, {
        headers: this.headers,
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async createIndex(indexName: string, primaryKey?: string): Promise<void> {
    try {
      const exists = await this.indexExists(indexName);
      if (exists) return;

      await fetch(`${this.host}/indexes`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          uid: indexName,
          primaryKey: primaryKey || 'id',
        }),
      });
      this.logger.log(`Created search index: ${indexName}`);
    } catch (error) {
      this.logger.error(`Failed to create index ${indexName}`, error);
    }
  }

  async addDocuments(indexName: string, documents: any[]): Promise<void> {
    try {
      await fetch(`${this.host}/indexes/${indexName}/documents`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ documents }),
      });
    } catch (error) {
      this.logger.error(`Failed to add documents to ${indexName}`, error);
    }
  }

  async updateDocuments(indexName: string, documents: any[]): Promise<void> {
    try {
      await fetch(`${this.host}/indexes/${indexName}/documents`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ documents }),
      });
    } catch (error) {
      this.logger.error(`Failed to update documents in ${indexName}`, error);
    }
  }

  async deleteDocument(indexName: string, documentId: string): Promise<void> {
    try {
      await fetch(`${this.host}/indexes/${indexName}/documents/${documentId}`, {
        method: 'DELETE',
        headers: this.headers,
      });
    } catch (error) {
      this.logger.error(`Failed to delete document from ${indexName}`, error);
    }
  }

  async search(
    indexName: string,
    query: string,
    options?: {
      limit?: number;
      offset?: number;
      filter?: string[];
      sort?: string[];
      attributesToRetrieve?: string[];
    },
  ): Promise<any> {
    try {
      const response = await fetch(`${this.host}/indexes/${indexName}/search`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ q: query, ...options }),
      });
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to search in ${indexName}`, error);
      return { hits: [], estimatedTotalHits: 0 };
    }
  }

  async configureIndex(
    indexName: string,
    settings: {
      searchableAttributes?: string[];
      filterableAttributes?: string[];
      sortableAttributes?: string[];
      rankingRules?: string[];
    },
  ): Promise<void> {
    try {
      await fetch(`${this.host}/indexes/${indexName}/settings`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(settings),
      });
    } catch (error) {
      this.logger.error(`Failed to configure index ${indexName}`, error);
    }
  }
}
