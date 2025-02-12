

import csv
import json
import os



def json_to_csv(input_json_file_path, output_csv_file_path_scales, output_csv_file_path_text, write_header=False):
    print(f'Reading in data from {input_json_file_path}...')
    # Read the JSON file
    with open(input_json_file_path, 'r') as json_file:
        data = json.load(json_file)
    # Ensure the data is a list of objects
    if not isinstance(data, list):
        raise ValueError("The JSON file must contain a list of objects.")

    # Check if the CSV files for scale and text responses exist
    csv_scale_file_exists = os.path.exists(output_csv_file_path_scales)
    csv_text_file_exists = os.path.exists(output_csv_file_path_text)
    write_scale_header = write_header
    write_text_header = write_header
    # Open the CSV file in append or write mode
    with open(output_csv_file_path_scales, 'a' if csv_scale_file_exists else 'w', newline='') as csv_file:
        for row in data:
            if row.get('trialType') == 'scale':
                fieldnames = list(row.keys()) + list(row.get('trialData').keys())
                fieldnames.remove('trialData')
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                # Write the header if needed
                if write_scale_header:
                    writer.writeheader()
                    write_scale_header = False

                row_concat = {**row, **row.get('trialData')}
                del(row_concat['trialData'])
                # Confirm that the fieldnames match the keys in the row
                assert set(fieldnames) == set(row_concat.keys())
                # Append the data
                writer.writerow(row_concat)
    with open(output_csv_file_path_text, 'a' if csv_text_file_exists else 'w', newline='') as csv_file:
        for row in data:
            if row.get('trialType') == 'question':
                fieldnames = list(row.keys()) + list(row.get('trialData').keys())
                fieldnames.remove('trialData')
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                # Write the header if needed
                if write_text_header:
                    writer.writeheader()
                    write_text_header = False

                row_concat = {**row, **row.get('trialData')}
                del(row_concat['trialData'])
                # Confirm that the fieldnames match the keys in the row
                assert set(fieldnames) == set(row_concat.keys())
                # Append the data
                writer.writerow(row_concat)




def main():
    json_file_path = '../../data/experiment_2/raw_data'
    csv_file_scales = 'scale_data.csv'
    csv_file_text = 'text_data.csv'

    json_files = [elem for elem in os.listdir(json_file_path) if elem.endswith('_trials.json')]
    for json_file in json_files:
        json_to_csv(
            input_json_file_path=os.path.join(json_file_path, json_file),
            output_csv_file_path_scales=os.path.join(json_file_path, '..', csv_file_scales),
            output_csv_file_path_text=os.path.join(json_file_path, '..', csv_file_text),
            write_header=json_files.index(json_file) == 0
        )




if __name__ == '__main__':
    main()