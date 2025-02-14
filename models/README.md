# MODELS

## In this directory

`/gpt_predictions`: Code for running GPT queries to elicit predictions for participants' introspection scale slider respones from experiment 2
- `prompts.py`: prompts used for GPT queries
- `gpt_predictions.py`: script for running GPT queries


## Instructions

1. Set global variables in `gpt_predictions.py` to reflect the desired config (e.g. the GPT model being used, the experiment being run)
2. Run `gpt_predictions.py` with the desired config
3. GPT predictions will be written to the root experiment folder under `/data/gpt_predictions`. These are used for analyses in `/analysis/gpt_predictions`.


