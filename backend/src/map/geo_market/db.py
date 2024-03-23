from typing import AsyncGenerator
import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DB_HOST, DB_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD

print(DB_HOST, DB_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD)


DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{DB_HOST}:{DB_PORT}/{POSTGRES_DB}"
Base = declarative_base()


logging.warning(DATABASE_URL)


engine = create_engine(DATABASE_URL)
# async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
#     async with async_session_maker() as session:
#         logging.warning("Соединение с БД")
#         yield session
        

# Создание фабрики сессий
session_maker = sessionmaker(bind=engine, expire_on_commit=False)

def get_sync_session():
    session = session_maker()
    logging.warning("Соединение с БД")
    return session
        