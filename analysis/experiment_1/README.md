# EXPERIMENT 1 ANALYSIS


## In this directory
- `json_to_csv_survey.py`: python script for generating a CSV with complete *post-experiment survey* data for participants. Reads in participants' survey responses saved as individual JSON files under the root `/data/experiment_1/raw_data` directory and aggregates them into a CSV file in the parent `/data/experiment_1` directory.
- `json_to_csv_trials.py`: python script for generating a CSV with complete *experiment trial* data for participants. Reads in participants' trial responses saved as individual JSON files under the root `/data/experiment_1/raw_data` directory and aggregates them into a CSV file in the parent `/data/experiment_1` directory.
- `experiment1_analyses-cogsci2025.R`: R script for analyses and figures reported in CogSci submission.


## Instructions
1. Download individual JSON files from the OSF data repo [here](https://osf.io/p84m6/) and save to the `/data/experiment_1/raw_data` directory
2. Run `json_to_csv_survey.py` to convert downloaded *post-experiment survey* JSON files to aggregated CSV
3. Run `json_to_csv_trials.py` to convert downloaded *experiment trial* JSON files to aggregated CSV
4. Run analysis scripts (`experiment1_analyses-cogsci2025.R`) with updated CSV files generated in previous steps