import { supabase } from "@/libs/supabase/supabase.client";

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}