import pandas as pd

def load_data():
    data = pd.read_csv(r'backend\src\insert_data\poi.csv', delimiter='|') #r'backend\src\insert_data\poi.csv'
    return data

def process_data(data):
    for index, row in data.iterrows():
        id = row['id']
        name = row['name']
        adress_name = row['address_name']
        addres_comment = row['address_comment']
        lat = row['lat']
        lon = row['lon']
        rubrics = [el for el in row['rubrics'][2:-2].split("', '")]


data = load_data()
process_data(data)