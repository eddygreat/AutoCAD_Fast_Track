const fs = require('fs');

async function fetchLessons() {
    const url = 'https://guzdgoidhnheocmyorgx.supabase.co/rest/v1/daily_lessons?select=day_number,text_content&order=day_number.asc';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1emRnb2lkaG5oZW9jbXlvcmd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0MzE3MSwiZXhwIjoyMDg3MTE5MTcxfQ.cVRz4UtxNUzmRf_3qbFgsX5FQDhx6-ca_4QJI1sbGdA';

    try {
        const response = await fetch(url, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        fs.writeFileSync('lessons_out2.json', JSON.stringify(data, null, 2));
        console.log(`Fetched ${data.length} lessons and saved to lessons_out2.json`);
    } catch (err) {
        console.error('Error:', err);
    }
}

fetchLessons();
