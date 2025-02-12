/*
 * This file contains the main functions for running the study.
 */


function getConsentHTML() {
    // HTML for consent form
    var consentHTML = {
        'str1': [
            "<div class='prevent-select bounding-div'> \
                <p id='legal'><u>Welcome!</u></p> \
            </div>",
            "<div class='prevent-select bounding-div'> \
                <p id='legal'>In this experiment, you will be asked to give your opinion on \
                    different questions people might use to start a conversation.</p> \
                <p>We expect this study to take approximately 15 minutes to complete, \
                    including the time it takes to read these instructions. \
                </p> \
            </div>"
        ].join(' '),
        'str2': [
            "<div class='prevent-select bounding-div'> \
                <p id='legal'><u>Consent to Participate</u></p> \
            </div>",
            "<div class='prevent-select bounding-div' style='text-align:left'> \
                <p id='legal'>By completing this study, you are participating in research \
                    being performed by cognitive scientists in the Stanford University \
                    Department of Psychology. The purpose of this research is to find out \
                    how people learn about each other using language and conversation. \
                    You must be at least 18 years old to participate. There are neither \
                    specific benefits nor anticipated risks associated with participation \
                    in this study. Your participation in this study is completely voluntary \
                    and you can withdraw at any time by simply exiting the study. You may \
                    decline to answer any or all of the following questions. Choosing not \
                    to participate or withdrawing will result in no penalty. Your anonymity \
                    is assured; the researchers who have requested your participation will \
                    not receive any personal information about you, and any information you \
                    provide will not be shared in association with any personally identifying information. \
                </p> \
                <p>If you have questions about this research, please contact the researchers by sending \
                    an email to \
                    <b><a href='mailto://ebrockbank@stanford.edu'>ebrockbank@stanford.edu</a></b>. \
                    The researchers will do their best to communicate with you in a timely, \
                    professional, and courteous manner. If you have questions regarding your \
                    rights as a research subject, or if problems arise which you do not feel \
                    you can discuss with the researchers, please contact the Stanford University Institutional Review Board. \
                </p> \
            </div> \
            <div class='prevent-select bounding-div'> \
                <p>Click 'Next' to continue participating in this study.</p> \
            </div>"
        ].join(' '),
        'str3': [
            "<div class='prevent-select bounding-div'> \
                <p> \
                    Two final notes. First, we recommend using Chrome for this study, as it can be buggy in other browsers. \
                </p> \
                <p> \
                    Second, please keep your browser maximized for the duration of this study. \
                </p> \
                <p> \
                    If you encounter a problem or error, send us an email (ebrockbank@stanford.edu) \
                    and we will make sure you are compensated for your time! \
                </p> \
            </div>"
        ].join(' '),
    };
    return consentHTML;
}


function getInstructionsHTML() {
    // HTML for instructions
    var instructionsHTML = {
        'str1': [
            "<div class='prevent-select bounding-div'> \
                <p>Here is how this task works:</p> \
                <p>On the next screen, you will be shown the text of a question someone might ask in conversation.</p> \
                <div><img src='img/instructions-conversation.png' width='200'></div> \
            </div>"
        ],
        'str2': [
            "<div class='prevent-select bounding-div'> \
                <p>Beneath the question, you will see a sliding scale asking you to <em>evaluate</em> the question.</p> \
                <div><img src='img/instructions-rating.png' width='250'></div> \
            </div>"
        ],
        'str3': [
            "<div class='prevent-select bounding-div'> \
                <p>For each question, your job will be to evaluate it on a few <em>different</em> scales.</p> \
                <div><img src='img/instructions-multiple-ratings.png' width='250'></div> \
                <p>In total, you will be asked to evaluate <b><em>10</em></b> \
                    different questions, each on the same set of sliding scales.</p> \
            </div>"
        ],
        'str4': [
            "<div class='prevent-select bounding-div'> \
                <p>Please think carefully about each question and respond honestly on the sliding scales.</p> \
            </div>"
        ],
    };
    return instructionsHTML;
}


function getFullscreenHTML() {
    // HTML for fullscreen notification
    var fullscreenHTML = "<div class='prevent-select bounding-div'> \
        <p>Let's get started!</p> \
        <p>The experiment will switch to fullscreen mode when you press the button below.</p> \
        </div>";
    return fullscreenHTML;
}


function getSliderPromptHTML(questionObject, scaleObject, questionIdx, scaleIdx, totalQuestions) {
    var scaleTextHTML = scaleFormat[scaleObject.prompt];
    var sliderPromptHTML = "<div class='prevent-select bounding-div'>" +
            "<div class='question-container'>" +
                "<p id='question-progress'>" +
                    "Question " + questionIdx + " of " + totalQuestions +
                "<\p>" +
                // NB: if formatting question text, use same approach as scale above
                "<p id='question-text'>" + questionObject.question + "<\p>" +
            "</div>" +
            "<div class='scale-container'>" +
                "<p id='scale-progress'>" +
                    "Evaluation " + scaleIdx +
                "<\p>" +
                "<p id='scale-text'>" + scaleTextHTML + "</p>" +
            "</div>" +
        "</div>";
    return sliderPromptHTML
}


function getComprehensionCheckHTML(questionObject, scaleObject, questionIdx, scaleIdx, totalQuestions) {
    var sliderPromptHTML = "<div class='prevent-select bounding-div'>" +
        "<div class='question-container'>" +
            "<p id='question-progress'>" +
                "Question " + questionIdx + " of " + totalQuestions +
            "<\p>" +
            // NB: if formatting question text, use same approach as scale above
            "<p id='question-text'>" + questionObject.question + "<\p>" +
        "</div>" +
        "<div class='scale-container'>" +
            "<p id='scale-progress'>" +
                "Evaluation " + scaleIdx +
            "<\p>" +
            "<p id='scale-text'>" + scaleObject.prompt + "</p>" +
        "</div>" +
    "</div>";
    return sliderPromptHTML
}


function getAgeHTML() {
    var ageHTML = "<div class='prevent-select bounding-div'> \
        <p>Age:&emsp;&emsp;&emsp;&emsp;&emsp;<input name='age' type='number' min=18 required/></p> \
        </div>";
    return ageHTML;
}


function getGenderHTML() {
    var genderHTML = "<div class='prevent-select bounding-div'> \
        <p><label for='gender'>Gender:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</label>";
    genderHTML += "<select id='gender' name='gender' required>";
    genderHTML += "<option disabled selected></option>";
    genderHTML += "<option value='Male'>Male</option>";
    genderHTML += "<option value='Female'>Female</option>";
    genderHTML += "<option value='Non-binary'>Non-binary</option>";
    genderHTML += "<option value='Prefer Not to Say'>Prefer Not to Say</option></select></p></div>";
    return genderHTML;
}


function getRaceHTML() {
    var raceHTML = "<div class='prevent-select bounding-div'> \
        <p><label for='race'>Race:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</label>";
    raceHTML += "<select id='race' name='race' required>";
    raceHTML += "<option disabled selected></option>";
    raceHTML += "<option value='Black'>Black</option>";
    raceHTML += "<option value='White'>White</option>";
    raceHTML += "<option value='Asian'>Asian</option>";
    raceHTML += "<option value='Indigenous'>Indigenous</option>";
    raceHTML += "<option value='Mixed race'>Mixed race</option>";
    raceHTML += "<option value='Other'>Other</option>";
    raceHTML += "<option value='Prefer Not to Say'>Prefer Not to Say</option></select></p></div>";
    return raceHTML;
}


function getTechnicalHTML() {
    var technicalHTML = "<div class='prevent-select bounding-div'> \
        <p>Did you encounter any technical issues? If so, can you please decribe them?</p>";
    technicalHTML += "<p><textarea id='technical' name='technical' rows='4' cols='80'></textarea></p></div>";
    return technicalHTML;
}


function getFeedbackHTML() {
    var feedbackHTML = "<div class='prevent-select bounding-div'> \
        <p>Do you have any other suggestions, feedback, or question ideas for the researchers?</p>";
    feedbackHTML += "<p><textarea id='feedback' name='feedback' rows='4' cols='80'></textarea></p></div>";
    return feedbackHTML;
}


function getCompletionHTML() {
    var completionHTML = "<div class='prevent-select bounding-div'> \
        <p>Congrats! You are all done. Thanks for participating in our study!</p> \
        <p>Click Finish to submit this study to Prolific.</p> \
        <p> After you click Finish, you will see a blank page on this web page \
            but will be redirected to the Prolific homepage. \
        </p> \
        <p>This means that your participation has been logged.<\p> \
        <p>If you do not receive credit immediately, please wait a few days. \
        </div>";
    return completionHTML;
}


function getQuestions(questionBank, questionFilters, nQuestionLookup, jsPsych) {
    logToBrowser('size of question bank', questionBank.length);
    logToBrowser('question bank', questionBank);
    logToBrowser('question bank filters', questionFilters);
    // filter on criteria in `questionFilters` global variable
    filteredQuestions = questionBank.filter(question => {
        return Object.entries(questionFilters).every(([key, value]) => question[key] === value);
    });
    logToBrowser('length of filtered questions', filteredQuestions.length);
    logToBrowser('filtered questions', filteredQuestions); // TEST: confirm that questions are filtered correctly

    // group by question category before sampling questions from each group
    var grouped = filteredQuestions.reduce((accumulator, question) => {
        const category = question.category;
        if (!accumulator[category]) {
            accumulator[category] = [];
        }
        accumulator[category].push(question);
        return accumulator;
    }, {});
    logToBrowser('filtered questions grouped by category', grouped); // TEST: confirm that questions are properly grouped by category

    // randomly select `nPersonalQuestions` and `nSmallTalkQuestions` questions from the grouped questions
    var sampledQuestions = {};
    Object.keys(grouped).forEach(category => {
        sampledQuestions[category] = jsPsych.randomization.sampleWithoutReplacement(grouped[category], nQuestionLookup[category]);
    });
    logToBrowser('questions per category', nQuestionLookup); // TEST: confirm that `nQuestionLookup` values are correct
    logToBrowser('sampled questions grouped by category', sampledQuestions); // TEST: confirm that question_id values, category, and number of questions in each category reflect proper sampling

    // re-flatten to array and shuffle between categories
    var subjectQuestions = jsPsych.randomization.shuffle(Object.values(sampledQuestions).flat());
    logToBrowser('sampled questions shuffled between categories', subjectQuestions); // TEST: confirm that question_id and category values now reflect shuffling between categories

    // return shuffled questions
    return subjectQuestions;
}


function getEvaluationScales(evaluationScales, evaluationScaleFilters, jsPsych) {
    // TODO consider moving these to separate functions (getEvaluationScales, filterEvaluationScales, shuffleEvaluationScales)
    logToBrowser('evaluation scales', evaluationScales);
    logToBrowser('evaluation scale filters', evaluationScaleFilters);
    // filter on criteria in `evaluationScaleFilters` global variable
    filteredScales = evaluationScales.filter(scale => {
        return Object.entries(evaluationScaleFilters).every(([key, value]) => scale[key] === value);
    });
    logToBrowser('filtered scales', filteredScales); // TEST: confirm that scales are filtered correctly

    // group by question_block
    var grouped = filteredScales.reduce((accumulator, evaluationScale) => {
        const block = evaluationScale.question_block;
        if (!accumulator[block]) {
            accumulator[block] = [];
        }
        accumulator[block].push(evaluationScale);
        return accumulator;
    }, {});
    logToBrowser('filtered scales grouped by block', grouped); // TEST: confirm that questions are in `scale_id` order within each group

    // shuffle items *within* each question_block group
    var groupShuffled = {};
    Object.keys(grouped).forEach(block => {
        groupShuffled[block] = jsPsych.randomization.shuffle(grouped[block]);
    });
    logToBrowser('filtered scales shuffled within each block', groupShuffled); // TEST: confirm that question `scale_id` values are shuffled within each group

    // shuffle *between* question_block groups
    var shuffledBlocks = jsPsych.randomization.shuffle(Object.keys(grouped));
    var shuffledScales = shuffledBlocks.map(block => groupShuffled[block]);
    logToBrowser('shuffled block order', shuffledBlocks); // TEST: confirm that question_block order is shuffled
    logToBrowser('shuffling between blocks', shuffledScales); // TEST: confirm that order of question_block values reflects shuffling between groups

    // re-flatten to array
    var subjectEvaluationScales = shuffledScales.flat();
    logToBrowser('shuffling between and within blocks, re-flattened to array', subjectEvaluationScales); // TEST: confirm that question scale_id reflects shuffling within and between groups

    // return evaluation scales
    return subjectEvaluationScales;
}


function getComprehensionCheck(index) {
    // NB: this needs to have fields that match the question objects in `question_bank.js`
    var questionObject = {
        "question_id": null,
        "question": "ATTENTION CHECK",
        "category": "comprehension check",
    };
    var questionIdx = null;

    if (index % 2 === 0) {
        // NB: this needs to have fields that match the scale objects in `evaluation_scales.js`
        var scaleObject = {
            "scale_id": null,
            "prompt": "Please drag the slider all the way to the end labeled STRAWBERRY",
            "min": "STRAWBERRY",
            "max": "PINEAPPLE",
            "question_block": null
        };
    } else {
        var scaleObject = {
            "scale_id": null,
            "prompt": "Please drag the slider all the way to the end labeled HAMBURGER",
            "min": "HOTDOG",
            "max": "HAMBURGER",
            "question_block": null
        };
    }
    var comprehensionCheckObject = {
        questionObject: questionObject,
        questionIdx: questionIdx,
        scaleObject: scaleObject,
        scaleIdx: null,
        trialIdx: null,
        isComprehensionCheck: true,
        comprehensionCheckRequestedResponse: index % 2 === 0 ? 0 : 100
    };

    return comprehensionCheckObject;
}


function processTrialResponse(trial, response, jsPsych) {
    // TODO consider revising this to just return packaged trial data object
    // add the trial data object to jsPsych.data in the main loop rather than passing here
    jsPsych.data.dataProperties.trialResponses.push({
        'subjectID': jsPsych.data.dataProperties.subjectID,
        'prolificID': jsPsych.data.dataProperties.prolificID,
        'studyID': jsPsych.data.dataProperties.studyID,
        'sessionID': jsPsych.data.dataProperties.sessionID,
        'DEBUG': jsPsych.data.dataProperties.DEBUG ? 1 : 0,
        'trialSubmitTS': Date.now(),
        'comprehensionCheck': trial.isComprehensionCheck ? 1: 0,
        'comprehensionCheckRequestedResponse': trial.comprehensionCheckRequestedResponse,
        // indices
        'trialIdx': trial.trialIdx,
        'questionIdx': trial.questionIdx,
        'scaleIdx': trial.scaleIdx,
        // question features
        'questionID': trial.questionObject.question_id,
        'question': trial.questionObject.question,
        'questionCategory': trial.questionObject.category, // 'personal' or 'small talk'
        // scale features
        'scaleID': trial.scaleObject.scale_id,
        'scaleBlock': trial.scaleObject.question_block,
        'scaleText': trial.scaleObject.prompt,
        'scaleTextMin': trial.scaleObject.min,
        'scaleTextMax': trial.scaleObject.max,
        // response features
        'sliderStart': response.slider_start,
        'response': response.response,
        'rt': response.rt,
        'timeElapsed': response.time_elapsed
    });
    logToBrowser('Updated trial data', jsPsych.data.dataProperties.trialResponses);
}

function formatTrialResponses(jsPsych, filename) {
    logToBrowser('Formatted trial responses', JSON.stringify(jsPsych.data.dataProperties.trialResponses));
    logToBrowser('Submitting JSON file', filename);
    return JSON.stringify(jsPsych.data.dataProperties.trialResponses);
}


function processSurveyResponse(data, jsPsych) {
    // logToBrowser('Processing survey data', data);
    if (!('subjectID' in jsPsych.data.dataProperties.surveyResponses)) {
        jsPsych.data.dataProperties.surveyResponses['subjectID'] = jsPsych.data.dataProperties.subjectID;
    }
    if (!('prolificID' in jsPsych.data.dataProperties.surveyResponses)) {
        jsPsych.data.dataProperties.surveyResponses['prolificID'] = jsPsych.data.dataProperties.prolificID;
    }
    if (!('studyID' in jsPsych.data.dataProperties.surveyResponses)) {
        jsPsych.data.dataProperties.surveyResponses['studyID'] = jsPsych.data.dataProperties.studyID;
    }
    if (!('sessionID' in jsPsych.data.dataProperties.surveyResponses)) {
        jsPsych.data.dataProperties.surveyResponses['sessionID'] = jsPsych.data.dataProperties.sessionID;
    }
    if (!('DEBUG' in jsPsych.data.dataProperties.surveyResponses)) {
        jsPsych.data.dataProperties.surveyResponses['DEBUG'] = jsPsych.data.dataProperties.DEBUG ? 1 : 0;
    }
    if ('age' in data.response) {
        jsPsych.data.dataProperties.surveyResponses['age'] = data.response.age;
        // add timestamp for submitting demographic info
        if (!('demographicSubmitTS' in jsPsych.data.dataProperties.surveyResponses)) {
            jsPsych.data.dataProperties.surveyResponses['demographicSubmitTS'] = Date.now();
        }
    }
    if ('gender' in data.response) {
        jsPsych.data.dataProperties.surveyResponses['gender'] = data.response.gender;
    }
    if ('race' in data.response) {
        jsPsych.data.dataProperties.surveyResponses['race'] = data.response.race;
    }
    if ('technical' in data.response) {
        jsPsych.data.dataProperties.surveyResponses['technicalIssues'] = data.response.technical;
        // add timestamp for submitting feedback info
        if (!('feedbackSubmitTS' in jsPsych.data.dataProperties.surveyResponses)) {
            jsPsych.data.dataProperties.surveyResponses['feedbackSubmitTS'] = Date.now();
        }
    }
    if ('feedback' in data.response) {
        jsPsych.data.dataProperties.surveyResponses['feedback'] = data.response.feedback;
    }
    logToBrowser('Updated survey response data', jsPsych.data.dataProperties.surveyResponses);
}

function formatSurveyResponses(jsPsych, filename) {
    logToBrowser('Formatted survey responses', JSON.stringify(jsPsych.data.dataProperties.surveyResponses));
    logToBrowser('Submitting JSON file', filename);
    return JSON.stringify(jsPsych.data.dataProperties.surveyResponses);
}



/*
 * This function is called from index.html when the page is loaded.
 */
function initStudy() {
    logToBrowser('Initializing...', null);
    // get experiment ID information from URL
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var prolificID = urlParams.get('PROLIFIC_PID')   // ID unique to the participant
    var studyID = urlParams.get('STUDY_ID')          // ID unique to the study
    var sessionID = urlParams.get('SESSION_ID')      // ID unique to the particular submission
    logToBrowser('PROLIFIC_PID', prolificID);
    logToBrowser('STUDY_ID', studyID);
    logToBrowser('SESSION_ID', sessionID);
    // initialize jsPsych
    var jsPsych = initJsPsych({
        show_progress_bar: true,
        // auto_update_progress_bar = false // TODO update progress bar manually for more fine-grained control?
    });
    jsPsych.data.addProperties({subjectID: jsPsych.randomization.randomID(10)}); // initialize subject ID
    jsPsych.data.addProperties({prolificID: prolificID});
    jsPsych.data.addProperties({studyID: studyID});
    jsPsych.data.addProperties({sessionID: sessionID});
    if (TEST) {
        jsPsych.data.addProperties({DEBUG: true});
    }
    if (SEED) {
        jsPsych.randomization.setSeed(10);
    }
    var timeline = [];

    // add consent and instructions
    var consentHTML = getConsentHTML();
    var instructionsHTML = getInstructionsHTML();
    var initMsg = {
        type: jsPsychInstructions,
        allow_keys: false,
        allow_backward: true,
        pages: [
            consentHTML.str1,
            consentHTML.str2,
            instructionsHTML.str1,
            instructionsHTML.str2,
            instructionsHTML.str3,
            instructionsHTML.str4,
            consentHTML.str3
        ],
        show_clickable_nav: true,
        allow_backward: true,
    };
    timeline.push(initMsg);

    // add fullscreen notification
    var fullscreenHTML = getFullscreenHTML();
    var fullscreenMsg = {
        type: jsPsychFullscreen,
        fullscreen_mode: true,
        message: fullscreenHTML
    };
    timeline.push(fullscreenMsg);

    // fetch test question bank from question_bank.js, filter N questions with number and filters from globals.js, shuffle using jsPsych native functions
    logToBrowser('Selecting questions...', null);
    var subjectQuestions = getQuestions(questionBank, questionFilters, nQuestionLookup, jsPsych);

    // fetch evaluation scales from evaluation_scales.js, filter with filters from globals.js, shuffle using jsPsych native functions
    logToBrowser('Selecting evaluation scales...', null);
    var subjectEvaluationScales = getEvaluationScales(evaluationScales, evaluationScaleFilters, jsPsych);

    // combine question and trial objects into a scale object that tracks indices for question, scale, and trial
    logToBrowser('Making trials...', null);
    var trialObject = [];
    var trialIdx = 0;
    var totalQuestions = 0; // used when displaying questions to participants
    // var totalScales = 0; // used when displaying scales to participants
    subjectQuestions.forEach((questionObject, questionIdx) => {
        subjectEvaluationScales.forEach((scaleObject, scaleIdx) => {
            trialObject.push({
                questionObject: questionObject,
                questionIdx: questionIdx,
                scaleObject: scaleObject,
                scaleIdx: scaleIdx,
                trialIdx: trialIdx,
                isComprehensionCheck: false,
                comprehensionCheckRequestedResponse: null
            });
            trialIdx++;
            // totalScales = (scaleIdx + 1) > totalScales ? (scaleIdx + 1) : totalScales;
        });
        totalQuestions = (questionIdx + 1) > totalQuestions ? (questionIdx + 1) : totalQuestions;
    });
    logToBrowser('trialObject', trialObject);

    // add comprehension checks
    var comprehensionCheckObjects = jsPsych.randomization.shuffle([getComprehensionCheck(0), getComprehensionCheck(1)]);
    // sample question and scale indices to interleave comprehension checks with experimental trials
    var comprehensionCheckQuestionIndices = jsPsych.randomization.sampleWithoutReplacement([...Array(subjectQuestions.length-1).keys()].slice(1), 2);
    var comprehensionCheckScaleIndices = jsPsych.randomization.sampleWithReplacement([...Array(subjectEvaluationScales.length).keys()], 2);
    logToBrowser('comprehension check question indices', comprehensionCheckQuestionIndices);
    logToBrowser('comprehension check scale indices', comprehensionCheckScaleIndices);
    // make jsPsych slider object for each trial and add to timeline
    var sliderCount = 0;
    trialObject.forEach((trial, arrayIdx) => {
        // at beginning of each question set, reset slider count and add status page interleaved between questions
        if (trial.scaleIdx === 0) {
            sliderCount = 1;
            if (arrayIdx > 0) {
                timeline.push({
                    type: jsPsychInstructions,
                    pages: [
                        "<div class='prevent-select bounding-div'> \
                            <p>Nice job! Click 'Next' to evaluate the next question.</p> \
                        </div>"
                    ],
                    show_clickable_nav: true,
                    allow_backward: false,
                    delay: false,
                    button_label_next: 'Next',
                });
            }
        }
        var sliderPromptHTML = getSliderPromptHTML(trial.questionObject, trial.scaleObject, trial.questionIdx+1, sliderCount, totalQuestions);
        timeline.push({
            type: jsPsychHtmlSliderResponse,
            stimulus: sliderPromptHTML,
            labels: [trial.scaleObject.min, trial.scaleObject.max],
            button_label: 'Submit',
            min: 0,
            max: 100,
            slider_start: 50,
            step: 1,
            slider_width: 600, // TODO make this a style global somewhere?
            require_movement: true,
            on_finish: (data) => {
                processTrialResponse(trial, data, jsPsych);
            }
        });
        // add comprehension check at sampled indices
        if((trial.questionIdx === comprehensionCheckQuestionIndices[0] && trial.scaleIdx === comprehensionCheckScaleIndices[0]) ||
            (trial.questionIdx === comprehensionCheckQuestionIndices[1] && trial.scaleIdx === comprehensionCheckScaleIndices[1])) {
            var comprehensionCheckObject = comprehensionCheckObjects.pop();
            comprehensionCheckObject.trialIdx = arrayIdx; // set index of comprehension check to match previous experimental trial
            comprehensionCheckObject.questionObject.question = trial.questionObject.question; // set question to match previous question text
            sliderCount ++;
            timeline.push({
                type: jsPsychHtmlSliderResponse,
                stimulus: getComprehensionCheckHTML(comprehensionCheckObject.questionObject, comprehensionCheckObject.scaleObject,
                    trial.questionIdx+1, sliderCount, totalQuestions),
                labels: [comprehensionCheckObject.scaleObject.min, comprehensionCheckObject.scaleObject.max],
                button_label: 'Submit',
                min: 0,
                max: 100,
                slider_start: 50,
                step: 1,
                slider_width: 600, // TODO make this a style global somewhere?
                require_movement: true,
                on_finish: (data) => {
                    processTrialResponse(comprehensionCheckObject, data, jsPsych);
                }
            });
        }
        sliderCount++;
    });
    logToBrowser('Timeline with comprehension checks', timeline);

    // save trial data to DataPipe
    jsPsych.data.addProperties({trialResponses: []}); // initialize manual responses array
    var trialDataFile = `${jsPsych.data.dataProperties.subjectID}_trials.json`;
    const saveTrialData = {
        type: jsPsychPipe,
        action: 'save',
        experiment_id: experimentIdOSF, // global variable
        filename: trialDataFile,
        data_string: () => formatTrialResponses(jsPsych, trialDataFile)
    };
    timeline.push(saveTrialData);

    // add post-experiment survey
    jsPsych.data.addProperties({surveyResponses: {}}); // initialize manual responses array
    // demographic questions
    var ageHTML = getAgeHTML();
    var genderHTML = getGenderHTML();
    var raceHTML = getRaceHTML();
    var demographicMsg = {
        type: jsPsychSurveyHtmlForm,
        preamble: "<div class='prevent-select'> \
            <p><b>Thank you for completing the experiment! \
            Please answer the following demographic questions:</b></p> \
            </div>",
        html:  ageHTML + genderHTML + raceHTML,
        on_finish: (data) => {
            processSurveyResponse(data, jsPsych);
        }
    };
    timeline.push(demographicMsg);

    // technical issues and empty space
    var technicalHTML = getTechnicalHTML();
    var feedbackHTML = getFeedbackHTML();
    var technicalMsg = {
        type: jsPsychSurveyHtmlForm,
        preamble: "<div class='prevent-select'> \
            <p><b>Please answer the following questions about the experiment:</b></p> \
            </div>",
        html: technicalHTML + feedbackHTML,
        on_finish: (data) => {
            processSurveyResponse(data, jsPsych);
        }
    };
    timeline.push(technicalMsg);

    // save survey data to DataPipe
    var surveyDataFile = `${jsPsych.data.dataProperties.subjectID}_survey.json`;
    const saveSurveyData = {
        type: jsPsychPipe,
        action: 'save',
        experiment_id: experimentIdOSF, // global variable
        filename: surveyDataFile,
        data_string: () => formatSurveyResponses(jsPsych, surveyDataFile)
    };
    timeline.push(saveSurveyData);


    // add completion page, re-direct to Prolific for payment
    var completionHTML = getCompletionHTML();
    var completionMsg = {
        type: jsPsychInstructions,
        pages: [completionHTML],
        show_clickable_nav: true,
        allow_backward: false,
        delay: false,
        button_label_next: 'Finish',

        on_finish: function() {
          window.onbeforeunload = null; // prevent warning message on redirect
          window.open(prolificCompletionURL, '_self'); //
        }
    };
    timeline.push(completionMsg);



    // run experiment
    jsPsych.run(timeline);

}