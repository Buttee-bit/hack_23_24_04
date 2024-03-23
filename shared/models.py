from __future__ import annotations

from datetime import datetime
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable

from sqlalchemy import (JSON, TIMESTAMP, BigInteger, Boolean, Column, DateTime, Float, ForeignKey, Integer, MetaData, SmallInteger, String,
                        Table, UniqueConstraint,FLOAT )
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """Base class"""

    metadata = MetaData(
        naming_convention={
            'ix': 'ix_%(column_0_label)s',
            'uq': 'uq_%(table_name)s_%(column_0_name)s',
            'ck': 'ck_%(table_name)s_`%(constraint_name)s`',
            'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
            'pk': 'pk_%(table_name)s',
        }
    )



class PoiData(Base):
    __tablename__ = 'poi_data'

    id: Mapped[int] = mapped_column(
        'id',
        Integer,
        primary_key=True,
        autoincrement=True
    )

    name: Mapped[str] = mapped_column(
        'name',
        String,
        nullable=True
    )

    adress_name: Mapped[str] = mapped_column(
        'adress_name',
        String,
        nullable=True
    )

    addres_comment: Mapped[str] = mapped_column(
        'addres_comment',
        String,
        nullable=True
    )

    lon: Mapped[float] = mapped_column(
        'lon',
        Float,
        nullable=True
    )

    lat: Mapped[float] = mapped_column(
        'lat',
        Float,
        nullable=True
    )

    rubrics: Mapped[ARRAY[str]] = mapped_column(
        'rubrics',
        ARRAY(String),
        nullable=True
    )