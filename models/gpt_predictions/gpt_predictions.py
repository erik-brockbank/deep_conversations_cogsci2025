

"""
Script for querying GPT for introspection study data.
"""

import csv
from datetime import datetime
from openai import OpenAI
import os
import pandas as pd

from prompts import *


# Globals
# TODO make these flags...
VERBOSE = False
GPT_MODEL = 'gpt-4o' # 'gpt-4o-mini', 'gpt-4o'
EXPERIMENT_ID = 'deep_shallow_contrast' # 'all_questions', 'deep_shallow_contrast', 'single_question'
# TODO replace this with logic that detects these numbers automatically in call to `get_free_response_object`
EXPERIMENT_EVIDENCE = {
    'all_questions': 6,
    'deep_shallow_contrast': 3,
    'single_question': 1
}


# File paths
OPENAI_API_KEY_PATH = os.path.join('..', '..', '..', 'openai_key.txt') # Key stored *outside* the repo
FREE_RESPONSE_DATA = os.path.join('..', '..', 'data', 'experiment_2', 'text_data_processed.csv')
SCALE_DATA = os.path.join('..', '..', 'data', 'experiment_2', 'scale_data_processed.csv')
OUTPUT_DIR = os.path.join('..', '..', 'data', 'gpt_predictions', EXPERIMENT_ID, GPT_MODEL)


# Connect to OpenAI client by providing API key located OUTSIDE the repository
def get_openai_client(api_key_path):
    with open(api_key_path, 'r') as file:
        api_key = file.readline().strip()
    return OpenAI(api_key=api_key)



# Read in csv at `file_path` and return a pandas dataframe with only the select columns
# Along the way, pivot wide so that each free response is a set of relevant columns (i.e., all "evidence" for a given subject is in the same row)
def get_free_response_dataframe(file_path, column_filters=None):
    required_columns = [
        # subject variables
        'subjectID', 'prolificID',
        # question variables
        'questionID', 'questionCategory', 'questionText',
        # response
        'response'
    ]
    df = pd.read_csv(file_path, usecols=required_columns)
    # If column_filters dictionary is provided, filter on key-value pair in dictionary (NB: assumes only a single key-value)
    if column_filters:
        df = df[df[list(column_filters.keys())[0]] == list(column_filters.values())[0]]
    # Rename 'response' column to 'questionResponse' (this avoids confusion with scale responses)
    df = df.rename(columns={'response': 'questionResponse'})
    # Add responseIndex to record the order of each unique questionID per participant
    df['responseIndex'] = df.groupby(['subjectID', 'prolificID']).cumcount() + 1
    # Pivot wider: Reshape the dataframe based on responseIndex
    df = df.set_index(['subjectID', 'prolificID', 'responseIndex'])
    df = df.unstack(level='responseIndex')
    df.columns = ['_'.join(map(str, col)) for col in df.columns]  # Flatten MultiIndex columns
    df = df.reset_index()

    return df


# Read in csv at `file_path` and return a pandas dataframe with only the select columns
def get_introspection_scale_response_dataframe(file_path):
    required_columns = [
        # subject variables
        'subjectID', 'prolificID',
        # scale variables
        'scaleID', 'scaleCategory', 'scaleText', 'scaleTextMin', 'scaleTextMax',
        'comprehensionCheck', 'comprehensionCheckRequestedResponse',
        # response
        'response'
    ]
    df = pd.read_csv(file_path, usecols=required_columns)
    # Filter out comprehension check rows
    df = df[df['comprehensionCheck'] != 1]
    # Fix formatting of scaleID (NB: must happen after the line above!)
    df['scaleID'] = df['scaleID'].astype(int)
    # Rename 'response' column to 'questionResponse' (this avoids confusion with scale responses)
    df = df.rename(columns={'response': 'scaleResponse'})
    return df


# Combine free response and scale data into a single dataframe
# Each row is a unique subject's scale response to a particular introspection scale (y), paired with *all* their free response answers (X)
def merge_free_response_and_scale_data(free_response_data, scale_data):
    return scale_data.merge(free_response_data, on=['subjectID', 'prolificID'], how='left')



# Wrapper function to read and format participant free response and scale data
def format_participant_data(free_response_data_path, scale_data_path, free_response_evidence):
    if free_response_evidence == 'all_questions':
        # Read participant free response data
        participant_free_resp_data = get_free_response_dataframe(free_response_data_path, column_filters=None)
        participant_free_resp_data['scaleResponseEvidence'] = 'all' # Evidence basis ('all' free responses, 'deep' only, etc.)
        # Read participant introspection scales
        # NB: this approach is un-opinionated about what the scales are supposed to be -- it treats whatever we have participant data for as the relevant thing to query GPT
        # (alternate approach would be to treat this more like an experiment w GPT as subject and have an opinionated list of scales)
        participant_scale_data = get_introspection_scale_response_dataframe(scale_data_path)
        # Join free response and scale data
        combined_data = merge_free_response_and_scale_data(participant_free_resp_data.copy(deep=True), participant_scale_data.copy(deep=True))
    elif free_response_evidence == 'deep_shallow_contrast':
        # Read participant free response data separately for 'personal' and 'small talk' questions
        participant_free_resp_data_personal = get_free_response_dataframe(free_response_data_path, column_filters={'questionCategory': 'personal'})
        participant_free_resp_data_personal['scaleResponseEvidence'] = 'personal' # Evidence basis ('all' free responses, 'deep' only, etc.)
        participant_free_resp_data_small_talk = get_free_response_dataframe(free_response_data_path, column_filters={'questionCategory': 'small talk'})
        participant_free_resp_data_small_talk['scaleResponseEvidence'] = 'small talk' # Evidence basis ('all' free responses, 'deep' only, etc.)
        # Read participant introspection scales
        participant_scale_data = get_introspection_scale_response_dataframe(scale_data_path)
        # Join free response and scale data separately for 'personal' and 'small talk' questions, then combine
        combined_data_personal = merge_free_response_and_scale_data(participant_free_resp_data_personal.copy(deep=True), participant_scale_data.copy(deep=True))
        combined_data_small_talk = merge_free_response_and_scale_data(participant_free_resp_data_small_talk.copy(deep=True), participant_scale_data.copy(deep=True))
        combined_data = pd.concat([combined_data_personal, combined_data_small_talk], ignore_index=True)
    elif free_response_evidence == 'single_question':
        # Read participant free response data then separate into individual dataframes for each question
        # TODO take symmetrical approach in 'deep_shallow_contrast' where we separate by question category after fetching
        participant_free_resp_data = get_free_response_dataframe(free_response_data_path, column_filters=None)
        # Get sets of columns for each question (e.g. the six 'questionID_x' columns)
        questionID_cols = participant_free_resp_data.columns[participant_free_resp_data.columns.str.startswith('questionID')]
        questionCategory_cols = participant_free_resp_data.columns[participant_free_resp_data.columns.str.startswith('questionCategory')]
        questionText_cols = participant_free_resp_data.columns[participant_free_resp_data.columns.str.startswith('questionText')]
        questionResponse_cols = participant_free_resp_data.columns[participant_free_resp_data.columns.str.startswith('questionResponse')]
        # Iterate through each question and create a separate dataframe for each
        question_dfs = []
        for i in range(len(questionID_cols)):
            # Create a subset of the data with only the columns relevant to this question
            free_resp_data_subset = participant_free_resp_data.copy(deep=True)
            questionID_exclusions = [col for col in questionID_cols if col != questionID_cols[i]]
            questionCategory_exclusions = [col for col in questionCategory_cols if col != questionCategory_cols[i]]
            questionText_exclusions = [col for col in questionText_cols if col != questionText_cols[i]]
            questionResponse_exclusions = [col for col in questionResponse_cols if col != questionResponse_cols[i]]
            free_resp_data_subset = free_resp_data_subset.drop(columns=questionID_exclusions + questionCategory_exclusions + questionText_exclusions + questionResponse_exclusions)
            # Rename columns to have a _1 suffix (NB: needed later when we fetch free response "objects" from the dataframe to generate prompts)
            free_resp_data_subset = free_resp_data_subset.rename(columns={
                questionID_cols[i]: 'questionID_1',
                questionCategory_cols[i]: 'questionCategory_1',
                questionText_cols[i]: 'questionText_1',
                questionResponse_cols[i]: 'questionResponse_1'
            })
            # Add a column to indicate the evidence basis for this question
            free_resp_data_subset['scaleResponseEvidence'] = f'free_response_{i+1}' # Evidence basis
            # Read participant introspection scales
            participant_scale_data = get_introspection_scale_response_dataframe(scale_data_path)
            # Join free response and scale data for this question
            combined_data = merge_free_response_and_scale_data(free_resp_data_subset, participant_scale_data)
            question_dfs.append(combined_data)

        # Combine all question dataframes into a single dataframe
        combined_data = pd.concat(question_dfs, ignore_index=True)



    # Sanity checks
    if VERBOSE:
        # print(f'FREE RESPONSE DATA: {participant_free_resp_data.shape}')
        # print(participant_free_resp_data.columns)
        # print(participant_free_resp_data.head())
        # print(f'INTROSPECTION SCALE DATA: {participant_scale_data.shape}')
        # print(participant_scale_data.columns)
        # print(participant_scale_data.head())
        print(f'COMBINED DATA: {combined_data.shape}')
        print(combined_data.columns)
        print(combined_data.head())

    return combined_data


# Add columns to the participant data that will track model predictions: scale prediction, timestamp, retries, source (e.g., 'gpt3.5'), experimentID (e.g. 'all scales')
# NB: This script is designed to perform all predictions for a single "experiment" condition (e.g., all scales, all free responses)
# Modify globals and re-run for different conditions, save output to independent files
def add_prediction_columns(prediction_df):
    prediction_df['scaleResponseUserPrompt'] = None             # NB: include full prompt in saved data just in case we modify
    prediction_df['scaleResponsePrediction'] = None             # predicted value provided by GPT
    prediction_df['scaleResponsePredictionTS'] = None           # timestamp of prediction (from OpenAI servers, not our logging)
    prediction_df['scaleResponsePredictionAttempt'] = None      # attempt index of the response (to track retries)
    prediction_df['scaleResponsePredictionSuccess'] = None      # boolean indicating whether the prediction was considered valid
    prediction_df['scaleResponsePredictionSource'] = None       # model used to generate prediction (e.g., 'gpt-4o-mini')
    prediction_df['scaleResponsePredictionExperimentID'] = None # Manually set variable indicating experiment (e.g., 'all scales)

    return prediction_df


# Take in a row of participant data (unprocessed, pandas itertuple row) and return a list of dictionaries, each representing a free response question and answer
# Only include the first `num_responses` responses
# NB: this is a bit of a shim to smooth the process of iterating row by row through the data and using a large swatch of column values to generate the prompt
def get_free_response_object(datarow, num_responses):
    free_responses = []
    for i in range(1, num_responses + 1):
        free_responses.append({
            'question_index': i,
            'question_id': getattr(datarow, f'questionID_{i}'),
            'question_category': getattr(datarow, f'questionCategory_{i}'),
            'question_text': getattr(datarow, f'questionText_{i}'),
            'question_response': getattr(datarow, f'questionResponse_{i}')
        })
    return free_responses


# Take in a row of participant data (unprocessed, pandas itertuple row) and return dictionary object with the relevant scale question and answer
# NB: this is a bit of a shim to smooth the process of iterating row by row through the data and using a large swatch of column values to generate the prompt
def get_scale_response_object(datarow):
    scale_response = {
        'scale_id': int(getattr(datarow, 'scaleID')),
        'scale_category': getattr(datarow, 'scaleCategory'),
        'scale_text': getattr(datarow, 'scaleText'),
        'scale_min': getattr(datarow, 'scaleTextMin'),
        'scale_max': getattr(datarow, 'scaleTextMax'),
        'scale_response': getattr(datarow, 'scaleResponse')
    }
    return scale_response



# Generate prompt for GPT based on free response and scale response objects
# TODO move this to prompts.py function where it is aware of globals and they are either passed in or local context
def get_prompt(free_responses, scale_response):
    user_prompt = ''
    # Make prompt with "evidence" (free response questions and answers)
    # TODO make this its own function?
    for i, response in enumerate(free_responses):
        if i == 0:
            user_prompt += USER_PROMPT_QUESTION_TEXT + '"' + response['question_text'] + '"' + '\n'
            user_prompt += USER_PROMPT_QUESTION_RESPONSE + '"' + response['question_response'] + '"' + '\n'
        else:
            user_prompt += USER_PROMPT_QUESTION_TEXT_CONTINUATION + '"' + response['question_text'] + '"' + '\n'
            user_prompt += USER_PROMPT_QUESTION_RESPONSE_CONTINUATION + '"' + response['question_response'] + '"' + '\n'

    # Append scale question to prompt
    # TODO make this its own function?
    user_prompt += USER_PROMPT_SCALE_TEXT + '"' + scale_response['scale_text'] + '"' + '\n'
    user_prompt += USER_PROMPT_SCALE_ENDPOINTS
    user_prompt += USER_PROMPT_SCALE_MIN + '"' + scale_response['scale_min'] + '"' + '\n'
    user_prompt += USER_PROMPT_SCALE_MAX + '"' + scale_response['scale_max'] + '"' + '\n'
    user_prompt += USER_PROMPT_SCALE_RESPONSE

    prompt = {
        'system': SYSTEM_PROMPT,
        'user': user_prompt
    }

    return prompt


# Function to wrap hyperparameters in dictionary object
# TODO make this actually useful (e.g. put hyperparm globals in a separate file with getter functions that wrap them in a dictionary)
def get_hyperparameters():
    return {
        'model': GPT_MODEL
    }


# Send prompt to GPT and process response
# Return formatted response (timestamp, model details, retries, response value)
def get_gpt_response(openai_client, prompt, hyperparameters):
    model = hyperparameters['model']
    messages = [
        {
            'role': 'system',
            'content': prompt['system']
        },
        {
            'role': 'user',
            'content': prompt['user']
        }
    ]
    completion = openai_client.chat.completions.create(
        model=model,
        messages=messages
    )
    attempt = 1
    completion_data = format_gpt_response(completion, attempt)
    if completion_data['success']:
        return completion_data
    else:
        # TODO handle retries
        return completion_data

# Convert GPT response object to a dictionary with relevant fields
# Flag if response is invalid
def format_gpt_response(completion, attempt):
    response_msg = completion.choices[0].message.content
    if response_msg is not None and response_msg.isdigit() and int(response_msg) >= 1 and int(response_msg) <= 100:
        # print('Valid response from GPT.')
        # print(f'Response was: {response_msg}')
        response_msg = int(response_msg)
        success = True
    else:
        print('Invalid response from GPT.')
        print(f'Response was: {response_msg}')
        success = False
    response = {
        'attempt': attempt,
        'response': response_msg,
        'responseTS': completion.created,
        'responseSource': completion.model,
        'success': success
    }
    return response


# Update dataframe with original participant data to include GPT response data
def update_participant_data(response_df, row_index, prompt, response, experiment_id):
    response_df.at[row_index, 'scaleResponseUserPrompt'] = prompt
    response_df.at[row_index, 'scaleResponsePrediction'] = response['response']
    response_df.at[row_index, 'scaleResponsePredictionTS'] = response['responseTS']
    response_df.at[row_index, 'scaleResponsePredictionAttempt'] = response['attempt']
    response_df.at[row_index, 'scaleResponsePredictionSuccess'] = int(response['success']) # cast to 1/0
    response_df.at[row_index, 'scaleResponsePredictionSource'] = response['responseSource']
    response_df.at[row_index, 'scaleResponsePredictionExperimentID'] = experiment_id
    return response_df


# Write participant data to CSV
# Makes a new folder with the current timestamp and saves the data there
def write_participant_data_to_file(df, output_dir):
    # Create a new directory with the current timestamp inside the results directory
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    output_dir = os.path.join(output_dir, timestamp)
    os.makedirs(output_dir, exist_ok=True) # exist_ok avoids throwing an error if directory already exists (just uses existing dir)

    # Save the dataframe inside the timestamp directory
    # TODO consider saving a separate text or JSON file with useful metadata as well (model run, hyperparameters, etc.)
    output_path = os.path.join(output_dir, 'model_predictions.csv')
    df.to_csv(output_path, index=False)
    print(f'\nParticipant data saved to: {output_path}')



def main():
    # Initialize OpenAI client
    print('\nInitializing OpenAI client...')
    openai_client = get_openai_client(OPENAI_API_KEY_PATH)

    # Read in and format participant data for GPT queries
    # Makes a copy of the participant data to store the GPT predictions
    print('\nReading and formatting participant data...')
    participant_data = format_participant_data(FREE_RESPONSE_DATA, SCALE_DATA, free_response_evidence=EXPERIMENT_ID)
    response_data = add_prediction_columns(participant_data.copy(deep=True))

    # Query GPT for predictions to each participant's introspection scale responses
    print('\nIterating through participant data...')
    for row in participant_data.itertuples():
        free_responses = get_free_response_object(row, num_responses=EXPERIMENT_EVIDENCE[EXPERIMENT_ID])
        scale_response = get_scale_response_object(row)
        # if row.Index < 1200: # DEBUG: run operations on subset of rows
        prediction_prompt = get_prompt(free_responses, scale_response)
        prediction_parameters = get_hyperparameters()
        print(f'...row: {row.Index}')
        response = get_gpt_response(openai_client, prediction_prompt, prediction_parameters)
        response_data = update_participant_data(response_data, row.Index, prediction_prompt['user'], response, EXPERIMENT_ID)

    print(f'\nGPT queries complete. Saving data ({response_data.shape})...')
    print(response_data.iloc[:,-6:].head()) # print only the GPT relevant columns added to the data (NB: prints everything after the 'prompt' column)
    write_participant_data_to_file(response_data, os.path.join(OUTPUT_DIR, EXPERIMENT_ID))



if __name__ == "__main__":
    print(f'\nRunning experiment: {EXPERIMENT_ID} with model {GPT_MODEL}...')
    if not os.path.isdir(os.path.join(OUTPUT_DIR, EXPERIMENT_ID)):
        os.makedirs(os.path.join(OUTPUT_DIR, EXPERIMENT_ID))
    main()