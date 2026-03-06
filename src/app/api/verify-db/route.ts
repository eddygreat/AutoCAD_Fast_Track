import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/utils/supabase/client'

export async function GET() {
    try {
        const supabase = createSupabaseClient()

        // Test the database connection by fetching a single row from 'courses'
        const { data, error } = await supabase
            .from('courses')
            .select('id')
            .limit(1)

        if (error) {
            console.error('Database connection error:', error.message)
            return NextResponse.json(
                { status: 'error', message: `Database Error: ${error.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                status: 'success',
                message: 'Database connection verified! Environment variables are correctly configured.'
            },
            { status: 200 }
        )
    } catch (err: any) {
        console.error('Environment configuration error:', err.message)
        return NextResponse.json(
            { status: 'error', message: `Configuration Error: ${err.message}` },
            { status: 500 }
        )
    }
}
