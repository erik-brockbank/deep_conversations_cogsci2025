

import csv
import json
import os



def json_to_csv(input_json_file_path, output_csv_file_path):
    print(f'Reading in data from {input_json_file_path} and writing to {output_csv_file_path}')
    # Read the JSON file
    with open(input_json_file_path, 'r') as json_file:
        data = json.load(json_file)

    # Ensure the data is a list of objects
    if not isinstance(data, list):
        raise ValueError('The JSON file must contain a list of objects.')

    # Extract field names from the first object
    fieldnames = data[0].keys()

    # Check if the CSV file exists
    file_exists = os.path.exists(output_csv_file_path)

    # Open the CSV file in append or write mode
    with open(output_csv_file_path, 'a' if file_exists else 'w', newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

        # If the file does not exist, write the header first
        if not file_exists:
            writer.writeheader()

        # Append the data
        for row in data:
            writer.writerow(row)


def main():
    json_file_path = '../../data/experiment_1/raw_data'
    csv_file = 'trial_data.csv'

    json_files = [elem for elem in os.listdir(json_file_path) if elem.endswith('_trials.json')]
    for json_file in json_files:
        json_to_csv(
            input_json_file_path=os.path.join(json_file_path, json_file),
            output_csv_file_path=os.path.join(json_file_path, '..', csv_file)
        )




if __name__ == '__main__':
    main()