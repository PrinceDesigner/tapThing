// supabase.module.ts
import { Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // 👈 rendi il servizio disponibile ad altri moduli
})
export class SupabaseModule {}