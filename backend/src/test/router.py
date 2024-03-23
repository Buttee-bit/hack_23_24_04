from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


from ..models import PoiData


router = APIRouter (
    prefix='/test',
    tags= ['test']
)


@router.get('/test_add')
async def test(session: AsyncSession = Depends(get_async_session)):
    stmt = insert(PoiData)
    stmt = stmt.values(
        id = 1,
        name = 'Булочные Ф. Вольчека, пекарня',
        adress_name = 'Суворовский проспект, 6',
        addres_comment = 'цокольный этаж',
        lat = 59.93287,
        lon = 30.368447,
        rubrics = ['Пекарни', 'Кондитерские изделия', 'Мороженое']
    )
    await session.execute(stmt)
    await session.commit()
    return 200

@router.get('/get_data')
async def get_data(session: AsyncSession = Depends(get_async_session)):
    stmt = select(PoiData)
    data = await session.execute(stmt)
    data = data.scalars().all()
    return data