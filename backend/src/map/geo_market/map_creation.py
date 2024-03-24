from operator import not_
import folium
from folium.plugins import MarkerCluster
from folium import FeatureGroup
from folium import plugins
from shared.models import Reality, PoiData, MetroStation, Tourist_attractions, Distance_metro, Distance_attraction
from .db import get_sync_session
from sqlalchemy import and_, any_,delete, desc, func, insert, or_, select, update

import geopandas as gpd

import geopandas as gpd
import pandas as pd
import numpy as np
import osmnx as ox
from geopy.distance import geodesic


class MapCreation:
    def __init__(
        self,
        width: int = 1400,
        height: int = 900,
        location: tuple = (59.94, 30.22),
        tiles: str = 'openstreetmap',
        zoom_start: int = 10,
        min_zoom: int = 1,
        max_zoom: int = 20,
        cities: list[str] = ['Санкт-Петербург']
        ) -> None:
        
        self.width = width
        self.height = height
        
        self.session = get_sync_session()
        
        self.map = folium.Map(
            # width=width,
            # height=height,
            location=location,
            tiles=tiles,
            zoom_start=zoom_start,
            min_zoom=min_zoom,
            max_zoom=max_zoom)
        
        polygon_krd = ox.geometries_from_place(cities, {'boundary':'administrative'}).reset_index()
        polygon_krd = polygon_krd[(polygon_krd['name'] == cities[0])]
        geometry = polygon_krd['geometry']

        plugins.Geocoder().add_to(self.map)

        fmtr = "function(num) {return L.Util.formatNum(num, 3) + ' º ';};"
        plugins.MousePosition(
            position="topright",
            separator=" | ",
            prefix="Coordinates:",
            lat_formatter=fmtr,
            lng_formatter=fmtr).add_to(self.map)

        minimap = plugins.MiniMap()
        self.map.add_child(minimap)

        overlay = gpd.GeoSeries(geometry).to_json()
        folium.GeoJson(overlay, name = 'Граница').add_to(self.map)

        self.marker_cluster = MarkerCluster(name='Конкуренты', show=False).add_to(self.map)
        self.metro_points = FeatureGroup(name='Метро', show=False).add_to(self.map)
        self.tourist_points = FeatureGroup(name='Достопримечательности', show=False).add_to(self.map)
        self.marker_points = MarkerCluster(name='Точки интереса').add_to(self.map)

        plugins.Fullscreen().add_to(self.map)
        plugins.LocateControl().add_to(self.map)
        plugins.Draw().add_to(self.map)

        plugins.MeasureControl(position='topright',
                                primary_length_unit='meters',
                                secondary_length_unit='miles',
                                primary_area_unit='sqmeters',
                                secondary_area_unit='acres').add_to(self.map)

        # folium.TileLayer('Stamen Terrain').add_to(self.map)
        # folium.TileLayer('Stamen Watercolor').add_to(self.map)
        # folium.TileLayer('cartodbpositron').add_to(self.map)
        # folium.TileLayer('cartodbdark_matter').add_to(self.map)

        folium.TileLayer(
            tiles='https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
            attr='OpenRailwayMap',
            name='OpenRailwayMap',
            show=False
        ).add_to(self.map)

        folium.TileLayer(
            tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr='Esri',
            name='Esri Satellite',
            overlay=False,
            control=True,
            show=False
        ).add_to(self.map)
        
        folium.TileLayer('openstreetmap').add_to(self.map)

        folium.LayerControl().add_to(self.map)
        
    def add_metro(self, metro_radius: int):
        stmt = select(MetroStation)
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        for station in data:
            # folium.Marker(
            # location=[station.lat, station.lon],
            # popup=station.name_station,
            # tooltip=station.name_station,
            # icon=folium.Icon(color="blue", icon="globe"),
            # ).add_to(self.metro_points)
            
            folium.Circle(
                location=[station.lat, station.lon],
                radius=metro_radius,
                color="blue",
                weight=1,
                fill_opacity=0.1,
                opacity=0.5,
                fill_color="blue",
                fill=False,  # gets overridden by fill_color
                popup=f"Метро: {station.name_station}",
                tooltip=f"Близкая к метро {station.name_station} область",
            ).add_to(self.metro_points)
            
    def add_tourist(self, tourist_radius: int):
        stmt = select(Tourist_attractions)
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        for place in data:
            if place.lat and place.lon:
                # folium.Marker(
                # location=[place.lat, place.lon],
                # popup=place.name,
                # tooltip=place.name,
                # icon=folium.Icon(color="orange", icon="camera"),
                # ).add_to(self.tourist_points)
                
                folium.Circle(
                    location=[place.lat, place.lon],
                    radius=tourist_radius,
                    color="orange",
                    weight=1,
                    fill_opacity=0.1,
                    opacity=0.5,
                    fill_color="orange",
                    fill=False,  # gets overridden by fill_color
                    popup=f"Достопримечательность: {place.name}",
                    tooltip=f'Близкая к достопримечательности "{place.name}" область',
                ).add_to(self.tourist_points)
    
    @staticmethod
    def get_realty_popup(row: Reality):
        popup = ''
        popup += f"<p>Адрес: {row.address}</p>"
        popup += f"<p>Тип объявления: {row.main_type}</p>"
        popup += f"<p>Тип помещения: {row.segment_type}</p>"
        popup += f"<p>Площадь: {row.total_arena}</p>"
        popup += f"<p>Этаж: {row.floor}</p>"
        popup += f"<p>Стоимость: {row.lease_price}</p>"
        popup += f"<p>Источник: {row.source_info}</p>"
        popup += f"<p>Ссылка: <a href={row.additional_info}target='_blank'>Ссылка</a></p>"
        popup += f"<p>Дата публикации: {row.update_date}</p>"
        popup += f"""<iframe id="inlineFrameExample"
                    title="Inline Frame Example"
                    width="300"
                    height="200"
                    src="https://ya.ru/">
                </iframe>
                """

        return popup
    
    def validate_by_metro(self, id, metro_radius):
        metro_stmt = select(Distance_metro).where(Distance_metro.id_poe == id)
        
        metro = self.session.execute(metro_stmt)
        metro = metro.scalars().all()[0]
        
        if metro.distance <= metro_radius:
            return True
        
        return False 
    
    def validate_by_tourist(self, id, tourist_radius):
        metro_stmt = select(Distance_attraction).where(Distance_attraction.id_reality == id)
        
        tourist = self.session.execute(metro_stmt)
        tourist = tourist.scalars().all()[0]
        
        if tourist.distance <= tourist_radius:
            return True
        
        return False 

    def search_by_params(
        self,
        price_min: int,
        price_max: int,
        square_min: int,
        square_max: int,
        floor_min: float,
        floor_max: float,
        segment_type_list: list[str],
        metro_radius: int,
        tourist_radius: int
        ):
        
        result = list()
        
        stmt = select(Reality).where(
            and_(
                Reality.lease_price.between(price_min, price_max),
                Reality.total_arena.between(square_min, square_max),
                Reality.floor.between(floor_min, floor_max),
                Reality.segment_type.in_(segment_type_list)
            )
        )
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        print(f'До радиусов {len(data)}')
        
        for el in data:
            if self.validate_by_metro(el.id, metro_radius) and self.validate_by_tourist(el.id, tourist_radius):
                result.append(el)
                
        print(f'После радиусов {len(result)}')
        return result

    def build_map(
        self,
        price_min: int = 100,
        price_max: int = 1000,
        square_min: int = 10,
        square_max: int = 1000,
        floor_min: float = 1.0,
        floor_max: float = 10.0,
        segment_type_list: list[str] = ['Офисные', 'Производственные', 'Торговые', 'Иные'],
        metro_radius: int = 1000,
        tourist_radius: int = 500
        ):
        
        # print(price_min)
        # print(price_max)
        # print(square_min)
        # print(square_max)
        # print(floor_min)
        # print(floor_max)
        # print(segment_type_list)
        # print(metro_radius)
        
        self.add_metro(metro_radius)
        self.add_tourist(tourist_radius)
        
        data: list[Reality] = self.search_by_params(
            price_min=price_min,
            price_max=price_max,
            square_min=square_min,
            square_max=square_max,
            floor_min=floor_min,
            floor_max=floor_max,
            segment_type_list=segment_type_list,
            metro_radius=metro_radius,
            tourist_radius=tourist_radius
        )
        
        for el in data:
            filter_data = self.filter_favorit()
            for i in filter_data:
                print(i.rubrics)
            # print(el.address)
        
            folium.Marker(
                location=[el.point_y, el.point_x],
                popup=self.get_realty_popup(el),
                tooltip=str(el.address),
                icon=folium.Icon(color="red", icon="flash"),
                ).add_to(self.marker_points)
        
        # self.map.get_root().width = f"{self.width}px"
        # self.map.get_root().height = f"{self.height}px"
        iframe = self.map.get_root()._repr_html_()

        point1 = (59.94, 30.22) # Пример координат первой точки
        point2 = (59.95, 30.23) # Пример координат второй точки

        # Расчет расстояния между двумя точками в метрах
        distance = geodesic(point1, point2).meters

        print(f"Расстояние между точками: {distance} метров")
        return iframe



    def filter_favorit(self, love=['Пекарни'], hate=['Рестораны'], radius=1):
        love_filter = or_(PoiData.rubrics.contains([rubric]) for rubric in love)
        hate_filter = or_(~PoiData.rubrics.contains([rubric]) for rubric in hate)
        
        combined_filter = and_(love_filter, hate_filter)
        
        result = self.session.query(PoiData).filter(combined_filter).all()
        
        return result


        


# while True:
#     map = MapCreation()
#     map.build_map()
#     time.sleep(3000)

# print('start')
# session = get_sync_session()
# stmt = select(PoiData)
# data = session.execute(stmt)
# DATA = data.scalars().all()
# print(DATA)
# session.close() # Не забудьт