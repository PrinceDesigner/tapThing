import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>("SUPABASE_URL")!;
    const key = this.config.get<string>("SUPABASE_BE_KEY")!;

    this.client = createClient(url, key);
  }
  
  getClient(): SupabaseClient {
    
    return this.client;
  }

  async getUserFromToken(token: string) {
    const { data, error } = await this.client.auth.getUser(token);
    if (error) throw error;
    return data.user;
  }
}