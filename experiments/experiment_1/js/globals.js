/*
 * Global variables for handling questions and evaluation scales
 */

const VERBOSE = true;
const TEST = false;
const SEED = false;

const experimentIdOSF = 'QjXaRR2ltg06';
const prolificCompletionURL = 'https://app.prolific.com/submissions/complete?cc=C1BU6V8G';

const nQuestionLookup = {
    'personal': 5,
    'small talk': 5,
};
const questionFilters = {
    'status': 'norming study 1',
    // "question_id": 1, // TESTING
};
const evaluationScaleFilters = {
    'status': 'norming study 1',
    // "scale_id": 1 // TESTING
};

const scaleFormat = {
    // 1
    "How personal is this question?": "How <em><b>PERSONAL</b></em> is this question?",
    // 2
    "How informative is this question?": "How <em><b>INFORMATIVE</b></em> is this question?",
    // 3
    "How deep is this question?": "How <em><b>DEEP</b></em> is this question?",
    // 4
    "If you asked this question to someone you just met, how much do you think their answer would help you get to know them better (assuming they provided an honest answer)?":
        "If <span style='color: #599f52'><b>you</b></span> asked this question to <span style='color: #6d78d8'><b>someone you just met</b></span>, how much do you think their answer would help you <em><b>GET TO KNOW THEM</b></em> better (assuming they provided an honest answer)?",
    // 5
    "If someone you just met asked you this question, how much do you think your answer would help them get to know you better (assuming you provided an honest answer)?":
        "If <span style='color: #6d78d8'><b>someone you just met</b></span> asked <span style='color: #599f52'><b>you</b></span> this question, how much do you think your answer would help them <em><b>GET TO KNOW YOU</b></em> better (assuming you provided an honest answer)?",
    // 6
    "If you asked this question to someone you just met, how much do you think you would learn about them (assuming they provided an honest answer)?":
        "If <span style='color: #599f52'><b>you</b></span> asked this question to <span style='color: #6d78d8'><b>someone you just met</b></span>, how much do you think you would <em><b>LEARN ABOUT THEM</b></em> (assuming they provided an honest answer)?",
    // 7
    "If someone you just met asked you this question, how much do you think they would learn about you (assuming you provided an honest answer)?":
        "If <span style='color: #6d78d8'><b>someone you just met</b></span> asked <span style='color: #599f52'><b>you</b></span> this question, how much do you think they would <em><b>LEARN ABOUT YOU</b></em> (assuming you provided an honest answer)?",
    // 8
    "If you asked this question to someone you just met, how close would you feel with them upon hearing their answer (assuming they provided an honest answer)?":
        "If <span style='color: #599f52'><b>you</b></span> asked this question to <span style='color: #6d78d8'><b>someone you just met</b></span>, how <em><b>CLOSE</b></em> would you feel with them upon hearing their answer (assuming they provided an honest answer)?",
    // 9
    "If someone you just met asked you this question, how close would you feel with them after sharing your answer (assuming you provided an honest answer)?":
        "If <span style='color: #6d78d8'><b>someone you just met</b></span> asked <span style='color: #599f52'><b>you</b></span> this question, how <em><b>CLOSE</b></em> would you feel with them after sharing your answer (assuming you provided an honest answer)?"
};