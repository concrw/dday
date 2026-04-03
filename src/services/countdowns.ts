import { supabase } from "../lib/supabase";

export interface CountdownInsert {
  title: string;
  date: string;
  emoji: string;
  color: string;
  share_token: string;
  session_id: string;
}

export async function insertCountdown(data: CountdownInsert): Promise<void> {
  const { error } = await supabase.from("countdowns").insert(data);
  if (error) throw error;
}
