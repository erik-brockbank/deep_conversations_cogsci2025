
import csv
import json

"""
CSV file downloaded from google sheet here:
- https://docs.google.com/spreadsheets/d/1LNvB3v5Q3heShc1w9i0aGiuQRlyuCqnQSVtOL7iLbSk/edit?usp=sharing

"""

def csv_to_json(csv_filename='question_bank.csv', json_filename='question_bank.json'):
    try:
        # Read the CSV file
        with open(csv_filename, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)

            # Convert rows to a list of dictionaries (exclude first non-header row, which has instructions for each column)
            data = [row for row in csv_reader if row['question_id'] != '']

        # Write the list of dictionaries to a JSON file
        with open(json_filename, mode='w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4)

        print(f'Successfully converted {csv_filename} to {json_filename}')
    except FileNotFoundError:
        print(f'Error: The file {csv_filename} was not found.')
    except Exception as e:
        print(f'An error occurred: {e}')



def main():
    csv_to_json()


if __name__ == '__main__':
    main()