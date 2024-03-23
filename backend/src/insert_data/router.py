from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


from ..models import PoiData
from .helper import load_data 

router = APIRouter (
    prefix='/insert_data',
    tags= ['insert_data']
)

@router.post('data')
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