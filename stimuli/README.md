# Stimuli


## In this directory

**Instruction graphics**
- `instruction_graphics.pptx`: powerpoint for making graphics used in experiment 1 instructions (these are saved as png files in the `/img` directory under experiment 1 code).


**Question bank files**
- `question_bank/question_bank.csv`: CSV file holding the question bank items. This is originally downloaded from google sheets [here](https://docs.google.com/spreadsheets/d/1LNvB3v5Q3heShc1w9i0aGiuQRlyuCqnQSVtOL7iLbSk/edit?usp=sharing).
- `question_bank/question_bank.json`: JSON file containing the question bank items as JSON objects. This file is created by converting the question bank CSV to JSON with the `csv_to_json.py` file in this directory. The JSON object is then copied over to the `question_bank.js` file of experiment 1 (`/experiments/experiment_1`).
- `question_bank/csv_to_json.py`: simple python script for converting question bank CSV file to JSON for use in norming study.


**Introspection scale files**
- `introspection_scales/introspection_scales.csv`: CSV file holding introspection scale items. This is originally downloaded from google sheets [here](https://docs.google.com/spreadsheets/d/14CBetc5XzYxlN-TMVm2YV0kFNLtpiR4TOUtBikBfeJQ/edit?usp=sharing).
- `introspection_scales/introspection_scales.json`: JSON file containing the introspection scale items as JSON objects. This file is reated by converting the introspection scale CSV to JSON with the `csv_to_json.py` file in the same directory.
- `introspection_scales/csv_to_json.py`: simple python script for converting the introspection scale CSV file to JSON for use in experiment 2.


## Creating the question bank
1. Download the question bank CSV stored in google sheets [here](https://docs.google.com/spreadsheets/d/1LNvB3v5Q3heShc1w9i0aGiuQRlyuCqnQSVtOL7iLbSk/edit?usp=sharing) and save as `question_bank/question_bank.csv`.
2. Run `question_bank/csv_to_json.py` to convert the CSV file above to JSON (writes to `question_bank/question_bank.json`).
3. Copy the JSON list in `question_bank/question_bank.json` to the `question_bank.js` file in experiment 1 (or anywhere the question bank is being used!).


## Creating the introspection scale bank
1. Download the introspection scale CSV stored in google sheets [here](https://docs.google.com/spreadsheets/d/14CBetc5XzYxlN-TMVm2YV0kFNLtpiR4TOUtBikBfeJQ/edit?usp=sharing) and save it as `introspection_scales/introspection_scales.py`.
2. Run `introspection_scales/csv_to_json.py` to convert the CSV file above to JSON (writes to `introspection_scales/introspection_scales.json`).
3. Copy the JSON list in `introspection_scales/introspection_scales.json` to the `introspection_scales.js` file in experiment 2 (or anywhere the introspection scales are being used!).