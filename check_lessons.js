const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Starting check...");
    try {
        const { data, error } = await supabase
            .from('daily_lessons')
            .select('day_number, text_content')
            .order('day_number', { ascending: true });

        if (error) {
            console.error('Error fetching lessons:', error);
        } else {
            console.log(`Fetched ${data?.length} lessons`);
            fs.writeFileSync('lessons_output.json', JSON.stringify(data, null, 2));
            console.log("Wrote to lessons_output.json");
        }
    } catch (e) {
        console.error("Exception in check:", e);
    }
}

check().then(() => {
    console.log("Check finished");
});
