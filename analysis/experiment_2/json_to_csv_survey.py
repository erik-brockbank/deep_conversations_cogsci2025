
import csv
import json
import os




def json_to_csv(input_json_file_path, output_csv_file_path):
    print(f'Reading in data from {input_json_file_path} and writing to {output_csv_file_path}')
    # Read the JSON file
    with open(input_json_file_path, 'r') as json_file:
        data = json.load(json_file)
    # Ensure the data is a dictionary
    if not isinstance(data, dict):
        raise ValueError('The JSON file must contain a single object.')
    # Extract field names from the dictionary
    fieldnames = data.keys()
    # Check if the CSV file exists
    file_exists = os.path.exists(output_csv_file_path)
    # Open the CSV file in append or write mode
    with open(output_csv_file_path, 'a' if file_exists else 'w', newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        # If the file does not exist, write the header first
        if not file_exists:
            writer.writeheader()
        # Append the single object as a row
        writer.writerow(data)


def main():
    json_file_path = '../../data/experiment_2/raw_data'
    csv_file = 'survey_data.csv'

    json_files = [elem for elem in os.listdir(json_file_path) if elem.endswith('_survey.json')]
    for json_file in json_files:
        json_to_csv(
            input_json_file_path=os.path.join(json_file_path, json_file),
            output_csv_file_path=os.path.join(json_file_path, '..', csv_file)
        )



if __name__ == '__main__':
    main()
