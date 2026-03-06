import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
    try {
        // 1. Verify Authorization
        // Vercel automatically includes an Authorization header with a Bearer token
        // matching the CRON_SECRET environment variable for chron jobs configured in vercel.json.
        const authHeader = request.headers.get('authorization');

        // Ensure you have CRON_SECRET set in your Vercel Environment Variables
        if (process.env.CRON_SECRET) {
            if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
                return new NextResponse('Unauthorized', { status: 401 });
            }
        } else {
            // If running locally or CRON_SECRET isn't set, log a warning but allow for testing
            console.warn('CRON_SECRET is not defined. Proceeding without authorization check for testing.');
        }

        // 2. Initialize Supabase Admin Client
        // We use the service role key to bypass RLS and perform a direct database query.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase environment variables');
            return new NextResponse('Internal Server Error', { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 3. Execute Lightweight Query
        // Fetching exactly one record from a core table (e.g., users or daily_lessons) 
        // is enough to keep the Supabase database instance from spinning down.
        const { data, error } = await supabase
            .from('daily_lessons')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Error pinging Supabase:', error);
            return new NextResponse('Error connecting to database', { status: 500 });
        }

        // 4. Return Success
        return NextResponse.json({
            success: true,
            message: 'Supabase pinged successfully',
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        console.error('Supabase keep-awake cron error:', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
