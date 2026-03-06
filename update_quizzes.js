const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const allQuizzes = {
    1: [
        {
            "question": "What command is used to start drawing a perfectly straight segment between two points?",
            "options": ["C", "REC", "L", "O"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Which function key toggles Object Snaps (OSNAP) on and off?",
            "options": ["F7", "F3", "F8", "F1"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Why is setting the correct Units critical before starting a drawing?",
            "options": ["It changes the interface color", "It ensures real-world drawing precision", "It automatically saves the file", "It creates 3D models"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What keyboard shortcut toggles the drawing Grid?",
            "options": ["F3", "G", "F7", "UN"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Which of these is NOT a basic drawing tool covered in Day 1?",
            "options": ["Rectangle", "Circle", "Offset", "Line"],
            "correctAnswerIndex": 2
        }
    ],
    2: [
        {
            "question": "Which command instantly creates parallel lines or concentric circles at a specified distance?",
            "options": ["Trim", "Offset", "Copy", "Mirror"],
            "correctAnswerIndex": 1
        },
        {
            "question": "To clean up overlapping or intersecting lines, which command should you use?",
            "options": ["Erase", "Trim", "Chamfer", "Extend"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What does the Fillet command do?",
            "options": ["Rounds off sharp corners", "Cuts an angled edge", "Fills an area with solid color", "Mirrors an object"],
            "correctAnswerIndex": 0
        },
        {
            "question": "What is the keyboard shortcut for the Mirror command?",
            "options": ["M", "RO", "MI", "MR"],
            "correctAnswerIndex": 2
        },
        {
            "question": "If you need to lengthen a line so it perfectly touches another object, which command is best?",
            "options": ["Stretch", "Trim", "Extend", "Scale"],
            "correctAnswerIndex": 2
        }
    ],
    3: [
        {
            "question": "What is the primary purpose of using Layers in AutoCAD?",
            "options": ["To make the file size smaller", "To organize and control visibility of different object types", "To convert 2D to 3D automatically", "To delete objects permanently"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What command opens the Layer Properties Manager?",
            "options": ["LA", "LY", "LP", "L"],
            "correctAnswerIndex": 0
        },
        {
            "question": "Which command allows you to hide all other layers except the one you select?",
            "options": ["LAYFRZ", "LAYOFF", "LAYISO", "LAYLCK"],
            "correctAnswerIndex": 2
        },
        {
            "question": "How do you bind multiple distinct objects together so they act as one selectable unit without creating a block?",
            "options": ["Group (G)", "Join (J)", "WBlock", "Layer"],
            "correctAnswerIndex": 0
        },
        {
            "question": "Why might you lock a layer during a multidisciplinary project?",
            "options": ["To hide it from view", "To prevent accidental modifications while working nearby", "To change its color to gray", "To delete it permanently"],
            "correctAnswerIndex": 1
        }
    ],
    4: [
        {
            "question": "Which command allows you to measure the exact distance between two points without adding permanent text to the drawing?",
            "options": ["DAL", "DLI", "DI", "D"],
            "correctAnswerIndex": 2
        },
        {
            "question": "What does the command 'D' open?",
            "options": ["Distance Tool", "Dimension Style Manager", "Drafting Settings", "Dynamic Block"],
            "correctAnswerIndex": 1
        },
        {
            "question": "To dimension the radius or angle of a pipe routing, which command is most appropriate for the angle?",
            "options": ["DLI", "DAN", "DAL", "DI"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What happens if a drawing is sent to the shop floor without clear, accurate dimensions?",
            "options": ["The software corrects it automatically", "Production halts or parts are manufactured incorrectly", "The file becomes corrupted", "Nothing, dimensions are optional"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Which dimension command is used for a straight horizontal or vertical measurement?",
            "options": ["DAL (Aligned)", "DLI (Linear)", "DAN (Angular)", "DI (Distance)"],
            "correctAnswerIndex": 1
        }
    ],
    5: [
        {
            "question": "What is a Block in AutoCAD?",
            "options": ["A locked layer", "A reusable collection of objects combined into a single asset", "A type of dimension style", "A solid 3D element"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Why are blocks considered the secret to drafting speed?",
            "options": ["They increase computer processing power", "They automatically draw your project for you", "They eliminate the need to redraw repetitive items like doors or valves", "They compress the file size to 10kb"],
            "correctAnswerIndex": 2
        },
        {
            "question": "What tool allows you to embed text data (like part numbers or supplier info) directly into a block?",
            "options": ["Multiline Text (MT)", "Attributes (ATTDEF)", "Dimension (DLI)", "Leaders (LE)"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What is the shortcut to open the Block Editor?",
            "options": ["B", "I", "BEDIT", "ATTDEF"],
            "correctAnswerIndex": 2
        },
        {
            "question": "What is the command to Insert an existing block into your drawing?",
            "options": ["IN", "I", "INS", "B"],
            "correctAnswerIndex": 1
        }
    ],
    6: [
        {
            "question": "What is the most important keyboard shortcut to use frequently during a long drafting session?",
            "options": ["Ctrl+C", "Ctrl+Z", "Ctrl+S (Save)", "Ctrl+P"],
            "correctAnswerIndex": 2
        },
        {
            "question": "If you have lost track of where your drawing is in model space, what command sequence fits it all back on screen?",
            "options": ["Z then E (Zoom Extents)", "Z then A (Zoom All)", "Pan Tool", "Z then W (Zoom Window)"],
            "correctAnswerIndex": 0
        },
        {
            "question": "What is the benefit of a capstone practice project?",
            "options": ["It unlocks 3D mode", "It builds muscle memory and context for when to use specific tools", "It replaces the need for layers", "It changes the AutoCAD interface"],
            "correctAnswerIndex": 1
        },
        {
            "question": "When building a floor plan, which tool is best to quickly create wall thicknesses from an outline?",
            "options": ["Copy", "Mirror", "Offset", "Trim"],
            "correctAnswerIndex": 2
        },
        {
            "question": "In a mechanical part drawing, how should centerlines be organized?",
            "options": ["Made a different color manually", "Put on their own dedicated Layer", "Grouped with the main outline", "Left as default object lines"],
            "correctAnswerIndex": 1
        }
    ],
    7: [
        {
            "question": "What is the primary use of Hatching in a 2D mechanical drawing?",
            "options": ["To make the lines thicker", "To indicate cutaway sections or solid material", "To add text descriptions", "To copy the object multiple times"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What is the keyboard shortcut for the Hatch command?",
            "options": ["HA", "H", "HT", "HE"],
            "correctAnswerIndex": 1
        },
        {
            "question": "If your hatch pattern spills out over the entire drawing, what is the most likely cause?",
            "options": ["The computer is frozen", "The hatch scale is too small", "There is a gap in the boundary you are trying to hatch", "You used a gradient instead of a solid"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Which command allows you to modify an existing hatch pattern's scale or angle?",
            "options": ["H", "HE (Hatch Edit)", "LAYISO", "O"],
            "correctAnswerIndex": 1
        },
        {
            "question": "In architectural drawings, why do we use different hatch patterns?",
            "options": ["To distinguish between distinct materials like concrete, earth, and steel", "To make the file look colorful", "To hide mistakes in the linework", "To change the unit scale"],
            "correctAnswerIndex": 0
        }
    ],
    8: [
        {
            "question": "Which command allows you to type paragraph-style notes on a drawing?",
            "options": ["Multiline Text (MT or T)", "Single Line Text", "Leader (LE)", "Table (TB)"],
            "correctAnswerIndex": 0
        },
        {
            "question": "What tool would you use to point an arrow at a specific geometry and attach a welding specification to it?",
            "options": ["Line", "Dimension", "Quick Leader (LE)", "Attribute"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Why is text formatting strictly controlled in engineering drawings?",
            "options": ["For artistic expression", "Because drawings are legal documents that must be perfectly readable", "To reduce ink usage during printing", "AutoCAD limits text styles to only one font"],
            "correctAnswerIndex": 1
        },
        {
            "question": "If you need to generate a clean Bill of Materials (BOM) on your drawing sheet, which command is best?",
            "options": ["MT", "TB (Table)", "LE", "BEDIT"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What does a Quick Leader (LE) consist of?",
            "options": ["A polygon and text", "An arrowhead, a landing line, and attached text/blocks", "A hatch pattern and a dimension", "Only text with a colored background"],
            "correctAnswerIndex": 1
        }
    ],
    9: [
        {
            "question": "What does UCS stand for in AutoCAD?",
            "options": ["Universal CAD Standard", "User Coordinate System", "Unified Construction Space", "User Custom Settings"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Which command takes a closed 2D profile and pulls it into a solid 3D object?",
            "options": ["Offset", "Stretch", "Extrude (EXT)", "Fillet"],
            "correctAnswerIndex": 2
        },
        {
            "question": "How does modeling in 3D prevent construction errors?",
            "options": ["It automatically orders materials", "It allows you to visually verify clashes and spatial conflicts before building", "It generates a cheaper design", "It removes the need for dimensions"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Which tool allows you to fluidly rotate the camera around your 3D model?",
            "options": ["Pan", "Zoom Extents", "3D Orbit (3DO)", "Viewports"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Why would you manipulate the User Coordinate System (UCS)?",
            "options": ["To change the drawing units", "To easily draw geometry directly onto an angled face of a 3D object", "To lock all layers at once", "To switch from Model to Paper space"],
            "correctAnswerIndex": 1
        }
    ],
    10: [
        {
            "question": "When opening a massive client drawing, what is the safest way to inspect the layer structure without breaking anything?",
            "options": ["Delete layers one by one", "Explode all blocks", "Use the LAYWALK command", "Change all objects to Layer 0"],
            "correctAnswerIndex": 2
        },
        {
            "question": "What does the Properties Palette (PR) show you?",
            "options": ["A list of recent files", "Detailed data about the currently selected object", "The internet browser", "Plotting settings only"],
            "correctAnswerIndex": 1
        },
        {
            "question": "If you need to find the exact X,Y,Z coordinates of a specific corner in a site plan, which command is fastest?",
            "options": ["Distance (DI)", "ID Point (ID)", "Dimension (DLI)", "Properties (PR)"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Why must you be careful when inheriting an existing master CAD file?",
            "options": ["Files expire after 30 days", "Modifying the wrong layer can cause cascading errors for everyone", "AutoCAD charges per click", "You cannot undo changes in an inherited file"],
            "correctAnswerIndex": 1
        },
        {
            "question": "When extracting geometry for your own subsystem, what modification command is best used to duplicate it safely?",
            "options": ["Move (M)", "Copy (CO)", "Erase (E)", "Trim (TR)"],
            "correctAnswerIndex": 1
        }
    ],
    11: [
        {
            "question": "What is the primary function of Model Space?",
            "options": ["Setting up title blocks for printing", "Drafting and designing the actual geometry at 1:1 scale", "Running AI prompts", "Writing long text documents"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What is the primary function of Paper Space?",
            "options": ["Creating 3D models", "Drafting geometry", "Setting up scaled views and title blocks for the client", "Hatching large areas"],
            "correctAnswerIndex": 2
        },
        {
            "question": "Which command creates a 'window' in Paper Space that looks into the Model Space?",
            "options": ["TB", "MV (Make Viewport)", "REC", "EXT"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Why use Viewports instead of just scaling the model geometry down?",
            "options": ["It allows multiple differently scaled views of the same 1:1 3D model on a single printed sheet", "AutoCAD prevents scaling geometry directly", "It makes the file size smaller", "It changes the colors automatically"],
            "correctAnswerIndex": 0
        },
        {
            "question": "What command is used to generate a realistic image of your applied 3D materials and lighting?",
            "options": ["MV", "PR", "RR (Render)", "3DO"],
            "correctAnswerIndex": 2
        }
    ],
    12: [
        {
            "question": "What do Plot Styles (CTB files) control during the printing process?",
            "options": ["The 3D angle of the camera", "How line colors translate into printed line weights and styles", "The spelling of your text annotations", "The scale of the viewport"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Why is publishing to a PDF the standard for issuing drawings?",
            "options": ["PDFs are editable in AutoCAD", "PDFs ensure the layout looks exactly the same on any device without CAD software", "PDFs are the only format printers understand", "PDFs automatically fix drafting errors"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What command opens the Page Setup Manager to configure paper size?",
            "options": ["PLOT", "PAGESETUP", "PREVIEW", "PS"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What happens if you print a mechanical drawing with all lines set to the exact same thickness?",
            "options": ["The drawing is highly professional", "The drawing becomes incredibly difficult to read and interpret", "The printer will reject the file", "The dimensions become invisible"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Before executing the final print, what crucial button should you always click in the Plot Dialog?",
            "options": ["Cancel", "Help", "Preview", "Apply to Layout"],
            "correctAnswerIndex": 2
        }
    ],
    13: [
        {
            "question": "How can an AI assistant save billable time for an AutoCAD drafter?",
            "options": ["By physically printing the document", "By instantly troubleshooting software errors and writing automation scripts", "By attending client meetings", "By installing AutoCAD faster"],
            "correctAnswerIndex": 1
        },
        {
            "question": "If a hatch pattern refuses to close, instead of searching forums for hours, what is a highly efficient modern workflow?",
            "options": ["Delete the drawing and start over", "Change the layer color", "Prompt an AI to explain common causes for hatch boundary errors", "Reboot the computer multiple times"],
            "correctAnswerIndex": 2
        },
        {
            "question": "What is required for an AI to give you a useful AutoCAD solution?",
            "options": ["A generalized, vague complaint", "A clear, specific prompt describing the intended action, the command used, and the exact error received", "Uploading a 500MB drawing file", "Speaking to it via microphone only"],
            "correctAnswerIndex": 1
        },
        {
            "question": "Can an AI assistant generate custom AutoLISP scripts for AutoCAD?",
            "options": ["No, AI only writes Python", "Yes, it can write scripts to automate repetitive tasks like counting blocks", "No, AutoLISP is obsolete", "Yes, but it won't work on Windows"],
            "correctAnswerIndex": 1
        },
        {
            "question": "What is the main objective of using AI in drafting engineering?",
            "options": ["To eliminate the need for engineers", "To artificially inflate drawing complexities", "To act as a competent assistant that eliminates bottlenecks and looks up standards instantly", "To automatically draw floor plans from scratch"],
            "correctAnswerIndex": 2
        }
    ],
    14: [
        {
            "question": "What is the primary purpose of a Capstone project?",
            "options": ["To learn new software entirely", "To take a project from a blank screen to a fully dimensioned, layered, and plotted PDF", "To memorize the AutoCAD manual", "To test your typing speed"],
            "correctAnswerIndex": 1
        },
        {
            "question": "How does completing a professional-grade drawing package benefit your career?",
            "options": ["It acts as a tangible portfolio piece to prove your engineering competency", "It grants you an official Autodesk certification", "It allows you to uninstall the software", "It guarantees a promotion"],
            "correctAnswerIndex": 0
        },
        {
            "question": "During a complex 14-day project, what habit is critical to avoiding data loss?",
            "options": ["Using only one layer", "Never saving until the end", "Using Ctrl+S frequently to save progress", "Working exclusively in 3D"],
            "correctAnswerIndex": 2
        },
        {
            "question": "If you encounter a roadblock during your final project, what new tool have you learned to use to unblock yourself?",
            "options": ["Deleting the problematic geometry", "Effective text prompting with an AI assistant", "Switching to Paper Space immediately", "Changing the coordinate system randomly"],
            "correctAnswerIndex": 1
        },
        {
            "question": "After issuing a final PDF, what indicates a successful drafting layout?",
            "options": ["The file size is extremely large", "The dimensions are missing", "Line weights clearly distinguish objects, text is readable, and viewports are scaled accurately", "The model space contains unnecessary construction lines"],
            "correctAnswerIndex": 2
        }
    ]
};

async function insertQuizzes() {
    console.log("Starting Quiz Update...");

    for (let day = 1; day <= 14; day++) {
        const questions = allQuizzes[day];
        if (questions) {
            const { error } = await supabase
                .from('daily_lessons')
                .update({ quiz_json: questions })
                .eq('day_number', day);

            if (error) {
                console.error(`Failed to update day ${day}:`, error);
            } else {
                console.log(`Successfully updated Day ${day} with ${questions.length} questions`);
            }
        }
    }
}

insertQuizzes().then(() => {
    console.log("Finished Quiz Updates.");
});
