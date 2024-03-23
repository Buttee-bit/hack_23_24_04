from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


from ..models import PoiData, Reality, MetroStation
from .helper import load_data, load_data_reality, get_data_json, get_data_csv

router = APIRouter (
    prefix='/insert_data',
    tags= ['insert_data']
)

@router.post('/data_poi')
async def data(session: AsyncSession = Depends(get_async_session)):
    data = load_data()
    for index, row in data.iterrows():
        stmt = insert(PoiData)
        stmt = stmt.values(
            name = row['name'], 
            adress_name = row['address_name'], 
            addres_comment = row['address_comment'], 
            lat = row['lat'], 
            lon = row['lon'], 
            rubrics = [el for el in row['rubrics'][2:-2].split("', '")]
        )
        await session.execute(stmt)
        await session.commit()
    return 200


@router.post('/data_reality')
async def data_reality(session: AsyncSession = Depends(get_async_session)):
    data = load_data_reality()
    for index, row in data.iterrows():
        stmt = insert(Reality)

        print(row['floor'])
        print(type(row['floor']))
        if pd.isnull(row['floor']):
            stmt = stmt.values(
                point_x = row['point_x'], 
                point_y = row['point_y'], 
                main_type = row['main_type'], 
                segment_type = row['segment_type'], 
                entity_type = row['entity_name'], 
                total_arena = row['total_area'], 
                lease_price = row['lease_price'], 
                additional_info = row['additional_info'], 
                source_info = row['source_info'], 
                address = row['address'], 
                update_date = pd.to_datetime(row['update_date'])    
        )
        else:

            stmt = stmt.values(
                point_x = row['point_x'], 
                point_y = row['point_y'], 
                main_type = row['main_type'], 
                segment_type = row['segment_type'], 
                entity_type = row['entity_name'], 
                total_arena = row['total_area'], 
                floor = row['floor'], 
                lease_price = row['lease_price'], 
                additional_info = row['additional_info'], 
                source_info = row['source_info'], 
                address = row['address'], 
                update_date = pd.to_datetime(row['update_date'])    
            )
            
        await session.execute(stmt)
        await session.commit()

    return 200



@router.post('/data_metro')
async def data_metro(session: AsyncSession = Depends(get_async_session)):
    data = get_data_json()
    for line in data['lines']:
        line_id = int(line['id'])
        for station in line['stations']:
            stmt = insert(MetroStation)
            stmt = stmt.values(
                hex_color=line['hex_color'],
                name_line=line['name'],
                name_station=station['name'],
                lat=station['lat'],
                lon=station['lng'],
                order=station['order']
            )
            await session.execute(stmt)
            await session.commit()
    return 200

@router.post('/data_tourist_attractions')
async def data_metro():
    get_data_csv()
    return 200