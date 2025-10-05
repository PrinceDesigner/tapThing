import { Injectable } from '@nestjs/common';
import { PromptDBService } from './prompt-db.service';

@Injectable()
export class PromptService {
  constructor(private promptDBService: PromptDBService) { }

  async findAll(userId: string, lang: string) {
    return this.promptDBService.findAll(userId, lang);
  }
}
