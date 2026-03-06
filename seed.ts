import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// IMPORTANT: We need the service role key to bypass RLS when seeding
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials (URL or Service Role Key). Please check .env.local");
    process.exit(1);
}

// Use Service Role Key for Admin write access during seeding
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const generateQuizForDay = (dayNum: number) => {
    return [
        {
            question: `Day ${dayNum} Question 1: What is the primary focus of Day ${dayNum}'s lesson?`,
            options: [
                `Learning the core concepts of Day ${dayNum}`,
                "Reviewing previous materials",
                "Advanced 3D Modeling",
                "Exporting to PDF"
            ],
            correctAnswerIndex: 0
        },
        {
            question: `Day ${dayNum} Question 2: Which tool is most frequently used in the exercises for Day ${dayNum}?`,
            options: [
                "The Line tool",
                `The special Day ${dayNum} specific tool`,
                "The Erase tool",
                "The Zoom tool"
            ],
            correctAnswerIndex: 1
        },
        {
            question: `Day ${dayNum} Question 3: How do you save your progress in AutoCAD according to Day ${dayNum}'s guidelines?`,
            options: [
                "Press Ctrl+S frequently",
                "AutoCAD saves automatically every 1 minute",
                "Wait until the end of the day",
                "Use the cloud sync button"
            ],
            correctAnswerIndex: 0
        },
        {
            question: `Day ${dayNum} Question 4: What is the recommended practice before starting Day ${dayNum}'s main assignment?`,
            options: [
                "Skip the video and start drawing",
                "Review the toolbars interface",
                "Set your units to Architectural or Decimal as required",
                "Change your background color to white"
            ],
            correctAnswerIndex: 2
        },
        {
            question: `Day ${dayNum} Question 5: True or False: The concepts learned in Day ${dayNum} will be critical for tomorrow's lesson.`,
            options: [
                "True",
                "False",
                "Only if you study architecture",
                "Depends on the version of AutoCAD"
            ],
            correctAnswerIndex: 0
        }
    ];
};

async function seed() {
    console.log("Seeding Database...");

    // 1. Delete existing courses (cascades to lessons and progress)
    const { error: deleteError } = await supabaseAdmin.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error("Error deleting old courses. Do you have RLS enabled and are you missing the service role key?", deleteError);
    } else {
        console.log("Cleared existing courses.");
    }

    // 2. Insert Course
    const { data: course, error: courseError } = await supabaseAdmin
        .from('courses')
        .insert([
            { title: 'AutoCAD Mastery: From Zero to Hero', total_days: 30 }
        ])
        .select()
        .single();

    if (courseError) {
        console.error("Error creating course:", courseError);
        return;
    }

    console.log("Created Course:", course.id);

    // 3. Generate 14 Lessons
    const lessonsToInsert = [];
    for (let day = 1; day <= 14; day++) {
        lessonsToInsert.push({
            course_id: course.id,
            day_number: day,
            text_content: `Welcome to Day ${day} of AutoCAD Mastery!\n\nToday, we will be diving deep into the core concepts required to master your CAD skills. \n\nMake sure to watch the video carefully and follow along on your own machine. We will cover essential commands, shortcuts, and best practices. \n\nAt the end of the lesson, there is a 5-question quiz to test your knowledge. You must pass with 80% (4/5 correct) to unlock the next day!`,
            mux_playback_id: 'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe', // Sample public Mux video ID (using the same placeholder video)
            quiz_json: generateQuizForDay(day)
        });
    }

    // 4. Batch Insert Lessons
    const { data: lessons, error: lessonError } = await supabaseAdmin
        .from('daily_lessons')
        .insert(lessonsToInsert)
        .select();

    if (lessonError) {
        console.error("Error creating lessons:", lessonError);
        return;
    }

    console.log(`Successfully created ${lessons.length} lessons for Day 1 through Day 14!`);
    console.log("Seed complete!");
}

seed();
