import pandas as pd
import json

def load_data():
    data = pd.read_csv(r'src/insert_data/poi.csv', delimiter='|') #r'backend\src\insert_data\poi.csv'
    return data

def load_data_reality():
    data = pd.read_csv(r'src/insert_data/realty.csv', delimiter=',')
    return data


def get_data_json():
    with open(r'src/insert_data/Russian_Underground.json', encoding='utf-8') as file:
        data = json.load(file)
        data = data[1]
        return data

    
    
# get_data_json()
# data = load_data()
# process_data(data)