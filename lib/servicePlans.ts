import { supabase } from "./supabaseClient";

export async function createServicePlan(userId: string, name: string) {
  const { data, error } = await supabase
    .from("service_plans")
    .insert([{ user_id: userId, name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServicePlans(userId: string) {
  const { data, error } = await supabase
    .from("service_plans")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
