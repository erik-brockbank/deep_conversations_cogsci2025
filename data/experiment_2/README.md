# EXPERIMENT 2 DATA

## In this directory
- `survey_data.csv`: summary CSV file for participants' post-experiment survey responses (one row per participant)
- `scale_data.csv`: summary CSV file for participants' introspection scale responses (one row per *trial* per participant)
- `text_data.csv`: summary CSV file for participants' free responses question answers (one row per *trial* per participant)
- `/raw_data`: folder of raw data JSON files for 200 participants collected on Prolific (these are originally saved in OSF [HERE](https://osf.io/t6gsh/))

## Instructions
1. Download individual JSON files from the OSF data repo [HERE](https://osf.io/t6gsh/) and save to the `/raw_data` directory
2. Generate **`survey_data.csv`** by running `json_to_csv_survey.py` in the root `/analysis/experiment_2` directory to convert downloaded *post-experiment survey* JSON files to aggregated CSV
3. Generate **`scale_data.csv`** and **`text_data.csv`** by running `json_to_csv_trials.py` in the root `/analysis/experiment_2` directory to convert downloaded *experiment trial* JSON files to aggregated CSVs
4. Run analysis scripts in the root `/analysis/experiment_2` directory with updated CSV files generated in previous steps