import { supabase } from "@/lib/supabase";

export interface DdayEvent {
  id: string;
  title: string;
  target_date: string;
  note: string | null;
  color: string | null;
  created_at: string;
}

export type CreateDdayEventInput = Omit<DdayEvent, "id" | "created_at">;

export async function fetchEvents(): Promise<DdayEvent[]> {
  const { data, error } = await supabase
    .from("dday_events")
    .select("*")
    .order("target_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchEvent(id: string): Promise<DdayEvent> {
  const { data, error } = await supabase
    .from("dday_events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createEvent(
  input: CreateDdayEventInput
): Promise<DdayEvent> {
  const { data, error } = await supabase
    .from("dday_events")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from("dday_events")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
