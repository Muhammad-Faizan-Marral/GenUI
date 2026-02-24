import { createClient } from "../lib/supabase/client";
import { Suspense } from "react";

// 1. Pehle data fetch karne wala component (Inner Component)
async function InstrumentsData() {
  const supabase = createClient();
  
  const { data: insturments, error } = await supabase
    .from("insturments")
    .select("*");

  if (error) return <div>Error: {error.message}</div>;
  if (!insturments || insturments.length === 0) return <div>No data found.</div>;

  return <pre>{JSON.stringify(insturments, null, 2)}</pre>;
}


export default function insturmentsPage() {
  return (
    <main>
      <h1>insturments List</h1>
      <Suspense fallback={<div>Loading insturments from Supabase...</div>}>
        <InstrumentsData />
      </Suspense>
    </main>
  );
}