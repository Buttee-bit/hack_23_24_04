import os
from pathlib import Path
import sys
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import pandas as pd
from sqlalchemy import and_, delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from .schemas import CustomMapView
from typing import Any

import logging

from .geo_market.map_creation import MapCreation


from ..models import PoiData

router = APIRouter(
    prefix='/custom_view',
    tags=['custom_view']
)

latest_data = []

def model_to_dict(model):
    # Преобразование модели SQLAlchemy в словарь, исключая системные атрибуты
    return {column.name: getattr(model, column.name) for column in model.__table__.columns}



async def data_to_excel(data, file_path='data.xlsx'):
    # Убедитесь, что data уже преобразован в список словарей
    df = pd.DataFrame(data)
    df.to_excel(file_path, index=False, engine='openpyxl')
    return file_path


@router.get('/download_excel')
async def download_excel():
    global latest_data
    if not latest_data:
        raise HTTPException(
            status_code=404, detail="No data available to download.")
    file_path = await data_to_excel(latest_data)
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=500, detail="Failed to create Excel file.")
    return FileResponse(path=file_path, filename="data.xlsx", media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


@router.get('/custom_map')
async def custom_map():
    global latest_data

    iframe, data = MapCreation().build_map()

    latest_data_dicts = [model_to_dict(item) for item in data]

    latest_data = latest_data_dicts

    return {
        "iframe": iframe,
        "data": data
    }


@router.post('/custom_map_params')
async def custom_map_params(custom_map_view: CustomMapView) -> Any:

    global latest_data

    iframe, data = MapCreation().build_map(
        custom_map_view.price_min,
        custom_map_view.price_max,
        custom_map_view.square_min,
        custom_map_view.square_max,
        custom_map_view.floor_min,
        custom_map_view.floor_max,
        custom_map_view.segment_type_list,
        custom_map_view.metro_radius,
        custom_map_view.tourist_radius,
        custom_map_view.love,
        custom_map_view.hate,
        custom_map_view.select_radius
    )
    logging.warning(custom_map_view)

    latest_data_dicts = [model_to_dict(item) for item in data]

    latest_data = latest_data_dicts

    return {
        "iframe": iframe,
        "data": data
    }