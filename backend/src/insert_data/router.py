from fastapi import APIRouter, Depends
import pandas as pd
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from geopy.distance import geodesic

from ..models import PoiData, Reality, MetroStation, Distance_metro, Tourist_attractions,  Distance_attraction
from .helper import load_data, load_data_reality, get_data_json, get_data_csv
from sqlalchemy.exc import IntegrityError

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

@router.post('/distance_metro')
async def distance_metro(session: AsyncSession = Depends(get_async_session)):
    stmt_poi = select(Reality)
    data_poi = await session.execute(stmt_poi)
    data_poi = data_poi.scalars().all()
    
    stmt_metro = select(MetroStation)
    data_metro = await session.execute(stmt_metro)
    data_metro = data_metro.scalars().all()
        
    for poi in data_poi:
        min_distance = float('inf')
        id_metro = 0
        point_poi = (poi.point_y, poi.point_x) 
        for metro in data_metro:
            point_metro = (metro.lat, metro.lon)
            distance_poi_metro = geodesic(point_poi, point_metro).meters

            if distance_poi_metro < min_distance:
                id_metro = metro.id
                min_distance = distance_poi_metro
        
        distance_instance = Distance_metro(
            id_poe=poi.id,
            id_metro=id_metro,
            distance=round(min_distance, 2)
        )
        try:
            session.add(distance_instance)
            await session.commit()  
        except IntegrityError as e:
            print(f"Ошибка IntegrityError: {e}")
            await session.rollback()  

        
    return 200

@router.post('/distance_attraction')
async def distance_attraction(session: AsyncSession = Depends(get_async_session)):
    stmt_poi = select(Reality)
    data_poi = await session.execute(stmt_poi)
    data_poi = data_poi.scalars().all()

    stmt_attractions = select(Tourist_attractions)
    data_attractions = await session.execute(stmt_attractions)
    data_attractions = data_attractions.scalars().all()

    for poi in data_poi:
        min_distance = float('inf')
        id_attra = 0
        point_poi = (poi.point_y, poi.point_x) 
        for attractions in data_attractions:
            point_metro = (attractions.lat, attractions.lon)
            distance_poi_metro = geodesic(point_poi, point_metro).meters

            if distance_poi_metro < min_distance:
                id_attractions = attractions.id
                min_distance = distance_poi_metro

        try:
            distance_instance = Distance_attraction(
            id_attraction=id_attractions,
            id_reality=poi.id,
            distance=round(min_distance, 2)
            )
            print(distance_instance)
            session.add(distance_instance)
            await session.commit()  
        except IntegrityError as e:
            print(f"Ошибка IntegrityError: {e}")
            await session.rollback()
        
    return 200