from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


from ..models import PoiData


router = APIRouter (
    prefix='/insert_data',
    tags= ['insert_data']
)

@router.post('data')
async def data(session: AsyncSession = Depends(get_async_session)):
    
    
    ...
