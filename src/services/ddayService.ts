import { supabase } from '@/lib/supabase';
import type { DdayEvent, CreateDdayEventInput } from '@/types';

export async function fetchEvents(): Promise<DdayEvent[]> {
  const { data, error } = await supabase
    .from('dday_events')
    .select('*')
    .order('target_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data as DdayEvent[];
}

export async function fetchEvent(id: string): Promise<DdayEvent> {
  const { data, error } = await supabase
    .from('dday_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as DdayEvent;
}

export async function createEvent(input: CreateDdayEventInput): Promise<DdayEvent> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('dday_events')
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DdayEvent;
}

export async function updateEvent(id: string, input: Partial<CreateDdayEventInput>): Promise<DdayEvent> {
  const { data, error } = await supabase
    .from('dday_events')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DdayEvent;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('dday_events')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
