import pandas as pd

def load_data():
    data = pd.read_csv(r'src/insert_data/poi.csv', delimiter='|') #r'backend\src\insert_data\poi.csv'
    return data

def load_data_reality():
    data = pd.read_csv(r'src/insert_data/realty.csv', delimiter=',')
    return data




# data = load_data()
# process_data(data)