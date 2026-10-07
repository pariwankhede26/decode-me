import csv
import os

filepath = "/app/applet/data/student_lifestyle_dataset.csv"
if os.path.exists(filepath):
    with open(filepath, 'r') as f:
        reader = list(csv.reader(f))
        print(f"Current rows in CSV: {len(reader)}")
else:
    print("CSV does not exist yet")
