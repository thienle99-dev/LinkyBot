import { config } from "dotenv";
config(); // Load env vars immediately

async function check() {
    // Dynamic import ensures environment variables are loaded before the module is evaluated
    const { supabase } = await import("../src/lib/db");

    console.log("Checking latest DB entry...");
    const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error("Error fetching from DB:", error);
    } else {
        // data is an array because of limit(1) with select('*')? 
        // Actually .single() was not used, so it returns an array [item] or []
        if (data && data.length > 0) {
            console.log("✅ Simulation Result - Latest Link in DB:");
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log("⚠️ No links found in DB.");
        }
    }
}

check();
