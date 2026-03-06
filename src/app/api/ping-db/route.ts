import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Prevent Next.js from caching this route, ensuring the DB is hit every time
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing environment variables for ping-db');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Use the service role key to reliably ping the DB
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Perform a tiny, fast read query to reset the 7-day inactivity timer
        const { count, error } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Ping DB Error:', error);
            return NextResponse.json({ error: 'Database ping failed' }, { status: 500 });
        }

        return NextResponse.json(
            { status: 'success', message: 'Database is awake', userCount: count },
            { status: 200 }
        );

    } catch (error) {
        console.error('Ping DB caught error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
