import { supabase } from "./supabaseClient";

export async function addSlide(servicePlanId: string, title: string) {
  const { data, error } = await supabase
    .from("slides")
    .insert([{ service_plan_id: servicePlanId, title }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSlides(servicePlanId: string) {
  const { data, error } = await supabase
    .from("slides")
    .select("*")
    .eq("service_plan_id", servicePlanId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}
