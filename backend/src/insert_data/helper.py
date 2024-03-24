import pandas as pd
import json
import csv
import re
from ..map.geo_market.db import get_sync_session
from sqlalchemy import insert

from ..models import Tourist_attractions

def load_data():
    data = pd.read_csv(r'src/insert_data/poi.csv', delimiter='|')
    return data

def load_data_reality():
    data = pd.read_csv(r'src/insert_data/realty.csv', delimiter=',')
    return data

def get_data_json():
    with open(r'src/insert_data/Russian_Underground.json', encoding='utf-8') as file:
        data = json.load(file)
        data = data[1]
        return data

def extract_coordinates(geolocation_string):
    matches = re.findall(r"[-+]?\d*\.\d+|\d+", geolocation_string)
    if len(matches) >= 2:
        latitude = float(matches[0])
        longitude = float(matches[1])
        return latitude, longitude
    else:
        return None, None

def get_data_csv():
    session = get_sync_session()
    with open(r'src/insert_data/tourist_attractions.csv', newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            name = row[0].strip("()").strip("'") 
            type_ = row[1].strip("'")
            region = row[2].strip("'")
            locality = row[3].strip("'")
            geolocation = row[4]
            
            if "St. Petersburg" in locality:
                latitude, longitude = extract_coordinates(geolocation)
                stmt = insert(Tourist_attractions)
                stmt = stmt.values(
                    name = name,
                    type = type_,
                    region = region,
                    locality = locality,
                    lat = longitude,
                    lon = latitude,
                )
                session.execute(stmt)
                session.commit()