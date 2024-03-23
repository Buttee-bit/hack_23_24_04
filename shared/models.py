from __future__ import annotations

from datetime import datetime
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


class Reality(Base):
    __tablename__ = 'reality_data'

    id: Mapped[int] = mapped_column(
        'id',
        Integer,
        primary_key=True,
        autoincrement=True
    )

    point_x: Mapped[float] = mapped_column(
        'point_x',
        Float,
        nullable=True
    )

    point_y: Mapped[float] = mapped_column(
        'point_y',
        Float,
        nullable=True
    )

    main_type: Mapped[str] = mapped_column(
        'main_type',
        String, 
        nullable=True
    )

    segment_type: Mapped[str] = mapped_column(
        'segment_type',
        String, 
        nullable=True
    )

    entity_type: Mapped[str] = mapped_column(
        'entity_type',
        String, 
        nullable=True
    )

    total_arena: Mapped[int] = mapped_column(
        'total_arena',
        Integer,
        nullable=True
    )

    floor: Mapped[float] = mapped_column(
        'floor',
        Float,
        nullable=True
    )
    lease_price: Mapped[int] = mapped_column(
        'lease_price',
        Integer,
        nullable=True
    )

    additional_info: Mapped[str] = mapped_column(
        'additional_info', 
        String,
        nullable=True
    )

    source_info: Mapped[str] = mapped_column(
        'source_info', 
        String,
        nullable=True
    )

    address: Mapped[str] = mapped_column(
        'address', 
        String,
        nullable=True
    )

    update_date: Mapped[datetime] = mapped_column(
        'update_date',
        DateTime, 
        nullable=True
    )


class MetroStation(Base):
    __tablename__ = 'metroStation'
    id: Mapped[int] = mapped_column(
        'id',
        Integer,
        primary_key=True,
        autoincrement=True
    )

    hex_color: Mapped[str] = mapped_column(
        'hex_color',
        String, 
        nullable=True
    )

    name_line: Mapped[str] = mapped_column(
        'name_line',
        String,
        nullable=True
    )
    name_station: Mapped[str] = mapped_column(
        'name_station',
        String,
        nullable=True
    )

    lat: Mapped[float] = mapped_column(
        'lat',
        Float,
        nullable=True
    )

    lon: Mapped[float] = mapped_column(
        'lon',
        Float,
        nullable=True
    )
    
    order: Mapped[int] = mapped_column(
        'order', 
        Integer,
        nullable=True
    )