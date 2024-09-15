import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/database.types";

export function createClient() {
  return createClientComponentClient<Database>();
}
