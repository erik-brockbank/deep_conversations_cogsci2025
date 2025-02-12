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
                <p id='legal'>In this experiment, you will be asked to introspect about yourself \
                    using a combination of sliding scales and free response questions.</p> \
                <p>We expect this study to take approximately 20 minutes to complete, \
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
                    If you encounter any issues, please email <TT>ebrockbank@stanford.edu</TT> \
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
                <p><b><em>In this experiment, you will be asked a series of questions about YOU</b></em>.</p> \
                <p>We are interested in how you perceive yourself. There are no wrong answers to these questions.</p> \
                <p>Please answer them as thoughtfully and honestly as you can.</p> \
            </div>"
        ],
        'str2': [
            "<div class='prevent-select bounding-div'> \
                <p>There are <b><em>two kinds of questions</em></b> you will be asked.</p> \
                <p>For most of the questions, you will be asked to make a judgment about yourself on a <b><em>sliding scale</em></b>.</p> \
                <p>These questions are fairly straightforward, but please take the time to answer as accurately as possible.</p> \
            </div>"
        ],
        'str3': [
            "<div class='prevent-select bounding-div'> \
                <p>For some of the questions, you will instead be asked to respond by <b><em>typing your answer</em></b> into a text box.</p> \
                <p>There are <b><em>six free response questions</em></b> like this over the course of the experiment.</p> \
            </div>"
        ],
        'str4': [
            "<div class='prevent-select bounding-div'> \
                <p>For each of the free response questions, you will have <b><em>2 minutes</em></b> to type your response.</p> \
                <p>A timer on the screen will indicate the time remaining before you can proceed to the next question.</p> \
                <p>For these questions, <b><em>try to write as much as you can</em></b> during the 2 minutes.</p> \
            </div>"
        ],
        'str5': [
            "<div class='prevent-select bounding-div'> \
                <p>Some of the free response questions may feel a little personal.</p> \
                <p>The answers you provide to these questions may be used in future research and read by other people.</p> \
                <p>However, <b><em>we will NEVER share any identifying information about YOU</em></b> when handling or sharing the responses.</p> \
                <p>Please do not include any information that might reveal your identity or someone else's in your answers.</p> \
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


function getSliderPromptHTML(scale) {
    var sliderPromptHTML = "<div class='prevent-select bounding-div'>" +
        "<div class='scale-container'>" +
            "<p id='scale-text'>" + scale.scale_text + "</p>" +
        "</div>" +
    "</div>";
    return sliderPromptHTML;
}


function getFreeResponseHTML(freeResponse) {
    // TODO rename the CSS classes below to match free response
    var freeResponseHTML = "<div class='prevent-select bounding-div'>" +
        "<div class='scale-container'>" +
            "<p id='scale-progress'>" +
                "Please take roughly two minutes to respond to the following question in as much detail as possible." +
            "<\p>" +
            "<p id='scale-text'>" + freeResponse.question + "</p>" +
        "</div>" +
        "<p><textarea id=free-response name='freeResp' rows='12' cols='120'></textarea></p>"
    "</div>";
    return freeResponseHTML;
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


function getIntrospectionScales(introspectionScales, introspectionScaleFilters, jsPsych) {
    logToBrowser('introspection scales', introspectionScales);
    logToBrowser('introspection scale filters', introspectionScaleFilters);
    // filter on criteria in `introspectionScaleFilters` global variable
    filteredScales = introspectionScales.filter(scale => {
        return Object.entries(introspectionScaleFilters).every(([key, value]) => scale[key] === value);
    });
    logToBrowser('filtered scales', filteredScales); // TEST: confirm that scales are filtered correctly

    return filteredScales;
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

    // group by `question_block` before sampling questions from each group
    var grouped = filteredQuestions.reduce((accumulator, question) => {
        const category = question.category;
        if (!accumulator[category]) {
            accumulator[category] = [];
        }
        accumulator[category].push(question);
        return accumulator;
    }, {});
    logToBrowser('filtered questions grouped by category', grouped); // TEST: confirm that questions are properly grouped

    // randomly select questions from each of the categories
    logToBrowser('questions per category', nQuestionLookup); // TEST: confirm that `nQuestionLookup` values are correct
    var sampledQuestions = {};
    Object.keys(grouped).forEach(category => {
        sampledQuestions[category] = jsPsych.randomization.sampleWithoutReplacement(grouped[category], nQuestionLookup[category]);
    });
    logToBrowser('sampled questions grouped by category', sampledQuestions); // TEST: confirm that question_id values, category, and number of questions in each block reflect proper sampling

    // re-flatten to array
    // NB: we don't bother shuffling within or between categories here because these will get shuffled among slider trials later
    var subjectQuestions = Object.values(sampledQuestions).flat();
    logToBrowser('sampled questions flattened', subjectQuestions); // TEST: confirm that question order the same as `sampledQuestions`, now flattened

    // return shuffled questions
    return subjectQuestions;

}


function processScaleResponse(scale, trialIdx, isComprehensionCheck, data, jsPsych) {
    jsPsych.data.dataProperties.trialResponses.push({
        // metadata
        'subjectID': jsPsych.data.dataProperties.subjectID,
        'prolificID': jsPsych.data.dataProperties.prolificID,
        'studyID': jsPsych.data.dataProperties.studyID,
        'sessionID': jsPsych.data.dataProperties.sessionID,
        'DEBUG': jsPsych.data.dataProperties.DEBUG ? 1 : 0,
        // trial info
        'trialIdx': trialIdx,
        'trialSubmitTS': Date.now(), // TODO replace with performance.now below?
        'trialType': 'scale',
        'trialData': {
            // scale features
            'scaleID': scale.scale_id,
            'scaleCategory': scale.category,
            'scaleText': scale.scale_text,
            'scaleTextMin': scale.scale_min,
            'scaleTextMax': scale.scale_max,
            'comprehensionCheck': isComprehensionCheck ? 1 : 0,
            'comprehensionCheckRequestedResponse': isComprehensionCheck ? scale.requested_response : null,
            // response features
            'sliderStart': data.slider_start,
            'response': data.response,
            'rt': data.rt,
            'timeElapsed': data.time_elapsed
        }
    });
    logToBrowser('Updated trial data', jsPsych.data.dataProperties.trialResponses);
}


function processTextResponse(question, trialIdx, data, jsPsych) {
    jsPsych.data.dataProperties.trialResponses.push({
        // metadata
        'subjectID': jsPsych.data.dataProperties.subjectID,
        'prolificID': jsPsych.data.dataProperties.prolificID,
        'studyID': jsPsych.data.dataProperties.studyID,
        'sessionID': jsPsych.data.dataProperties.sessionID,
        'DEBUG': jsPsych.data.dataProperties.DEBUG ? 1 : 0,
        // trial info
        'trialIdx': trialIdx,
        'trialSubmitTS': Date.now(), // TODO replace with performance.now below?
        'trialType': 'question',
        'trialData': {
            // question features
            'questionID': question.question_id,
            'questionCategory': question.category,
            'questionText': question.question,
            // response features
            'response': data.response.freeResp,
            'rt': data.rt,
            'timeElapsed': data.time_elapsed
        }
    });
    logToBrowser('Updated trial data', jsPsych.data.dataProperties.trialResponses);
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


function formatTrialResponses(jsPsych, filename) {
    logToBrowser('Formatted trial responses', JSON.stringify(jsPsych.data.dataProperties.trialResponses));
    logToBrowser('Submitting JSON file', filename);
    return JSON.stringify(jsPsych.data.dataProperties.trialResponses);
}

function formatSurveyResponses(jsPsych, filename) {
    logToBrowser('Formatted survey responses', JSON.stringify(jsPsych.data.dataProperties.surveyResponses));
    logToBrowser('Submitting JSON file', filename);
    return JSON.stringify(jsPsych.data.dataProperties.surveyResponses);
}





/*
 * This function is called from index.html when the page is loaded.
 */
// TODO factor this into "init" function that fetches scales, questions, etc, "make trials" function that combines them, and "make timeline" function that creates the timeline
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
            instructionsHTML.str5,
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

    // get introspection scales
    logToBrowser('Selecting introspection scales...', null);
    var subjectScales = getIntrospectionScales(introspectionScales, introspectionScaleFilters, jsPsych);

    // get free response questions
    logToBrowser('Selecting questions...', null);
    var subjectQuestions = getQuestions(questionBank, questionFilters, nQuestionLookup, jsPsych);


    // combine scales and questions and shuffle
    var trialsCombined = jsPsych.randomization.shuffle([...subjectScales, ...subjectQuestions]);
    // add comprehension checks to trial set
    comprehensionCheckScales.forEach((scale, i) => {
        // randomly select (0-indexed) index from offset X to trialsCombined.length-X
        // NB: this will change the range of possible indices as we add comprehension check items (array length changes)
        var offset = 3;
        var idx = jsPsych.randomization.sampleWithoutReplacement([...Array(trialsCombined.length-offset).keys()].slice(offset), 1);
        trialsCombined.splice(idx, 0, scale);
    });
    logToBrowser('Combined trials', trialsCombined); // TEST: confirm that scales and questions are combined and shuffled

    // add trials to timeline
    trialsCombined.forEach((trialObject, trialIdx) => {
        if (trialObject.hasOwnProperty('scale_id')) {
            var isComprehensionCheck = trialObject['scale_id'] === null; // NB: checks that property value is actually null; not true if missing value
            var sliderPromptHTML = getSliderPromptHTML(trialObject);
            timeline.push({
                type: jsPsychHtmlSliderResponse,
                stimulus: sliderPromptHTML,
                labels: [trialObject.scale_min, trialObject.scale_max],
                button_label: 'Submit',
                min: 0,
                max: 100,
                slider_start: 50,
                step: 1,
                slider_width: 600, // TODO make this a style global somewhere?
                require_movement: true,
                on_load: () => {
                    document.querySelector("#trial-timer").style.visibility = "hidden";
                    document.querySelector("#trial-index").innerHTML = '<span id="trial-index-text">Question ' + (trialIdx + 1).toString() + '</span>';
                    document.querySelector("#trial-index").style.visibility = "visible";
                },
                on_finish: (data) => {
                    processScaleResponse(trialObject, trialIdx + 1, isComprehensionCheck, data, jsPsych);
                }
            });
        } else if (trialObject.hasOwnProperty('question_id')) {
            var freeResponseHTML = getFreeResponseHTML(trialObject);
            timeline.push({
                type: jsPsychSurveyHtmlForm,
                html: freeResponseHTML,
                on_load: () => {
                    // toggle visibility and button press
                    document.querySelector(".jspsych-btn").disabled = true; // disable 'Continue' button until timer ends
                    document.querySelector("#trial-index").innerHTML = '<span id="trial-index-text">Question ' + (trialIdx + 1).toString() + '</span>';
                    document.querySelector("#trial-timer").innerHTML = '<span id="timer-text">Time remaining: 2:00</span>';
                    document.querySelector("#trial-index").style.visibility = "visible";
                    document.querySelector("#trial-timer").style.visibility = "visible";
                    // start timer
                    // source: https://github.com/jspsych/jsPsych/discussions/1690
                    var wait_time = freeResponseWaitTimeSec * 1000; // in milliseconds
                    var start_time = Date.now();
                    var interval = setInterval(() => {
                        var time_left = wait_time - (Date.now() - start_time);
                        var minutes = Math.floor(time_left / 1000 / 60);
                        var seconds = Math.floor((time_left - (minutes * 1000 * 60)) / 1000);
                        var seconds_str = seconds.toString().padStart(2, '0');
                        document.querySelector('#trial-timer').innerHTML = '<span id="timer-text">Time remaining: ' + minutes + ':' + seconds_str + '</span>';
                        if (time_left <= 0) {
                            document.querySelector('#trial-timer').innerHTML = '<span id="timer-text"><font color="red">Go ahead and submit when you are ready!</font></span>';
                            document.querySelector(".jspsych-btn").disabled = false; // re-enable 'Continue' button
                            clearInterval(interval);
                        }
                    }, 250);
                },
                on_finish: (data) => {
                    // TODO explicitly extract time remaining from html element displaying it and pass here?
                    processTextResponse(trialObject, trialIdx + 1, data, jsPsych);
                }
            });
        }
    });

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
    timeline.push(saveTrialData); // Uncomment this when ready to send data to DataPipe


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
        // TODO may need to put this in the save data above so these don't linger on "saving" screen
        on_load: () => {
            document.querySelector("#trial-index").style.visibility = "hidden";
            document.querySelector("#trial-timer").style.visibility = "hidden";
        },
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
    timeline.push(saveSurveyData); // Uncomment this when ready to send data to DataPipe


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