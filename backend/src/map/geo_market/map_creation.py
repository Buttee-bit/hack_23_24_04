import folium
from folium.plugins import MarkerCluster
from folium import FeatureGroup
from folium import plugins
from shared.models import Reality, PoiData, MetroStation
from .db import get_sync_session
from sqlalchemy import and_,delete, desc, func, insert, select, update

import geopandas as gpd

import geopandas as gpd
import pandas as pd
import numpy as np
import osmnx as ox
import time


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
            width=width,
            height=height,
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

        self.marker_cluster = MarkerCluster(name='Конкуренты').add_to(self.map)
        self.marker_points = FeatureGroup(name='Точки интереса', show=False).add_to(self.map)

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
            name='OpenRailwayMap'
        ).add_to(self.map)

        folium.TileLayer(
            tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr='Esri',
            name='Esri Satellite',
            overlay=False,
            control=True
        ).add_to(self.map)
        
        folium.TileLayer('openstreetmap').add_to(self.map)

        folium.LayerControl().add_to(self.map)
        
    @staticmethod
    def read_data(
        poi_path: str = "poi.csv",
        realty_path: str = "realty.csv"
        ):
        
        poi = pd.read_csv(poi_path, sep = '|')
        realty = pd.read_csv(realty_path, sep = ',')
        
        return poi, realty
    
    @staticmethod  
    def get_poi_popup(row):
        popup = ''
        popup += f"Название: {row['name']}\n"
        popup += f"Адрес: {row['address_name']}\n"
        popup += f"Комметарий: {row['address_comment']}\n"
        popup += f"Категории: {row['rubrics']}\n"

        return popup
    
    @staticmethod
    def get_realty_popup(row: Reality):
        popup = ''
        popup += f"Адрес: {row.address}\n"
        popup += f"Тип объявления: {row.main_type}\n"
        popup += f"Тип помещения: {row.segment_type}\n"
        popup += f"Площадь: {row.total_arena}\n"
        popup += f"Этаж: {row.floor}\n"
        popup += f"Стоимость: {row.lease_price}\n"
        popup += f"Источник: {row.source_info}\n"
        popup += f"Ссылка: <a href={row.additional_info}target='_blank'>Ссылка</a>"
        popup += f"Дата публикации: {row.update_date}\n"

        return popup

    def visualize_polygons_all_data(self):
        
        poi, realty = self.read_data()

        for index, row in poi.iterrows():

            folium.Marker(
            location=[row['lat'], row['lon']],
            popup=self.get_poi_popup(row),
            # tooltip=str(row['name']),
            icon=folium.Icon(color="red", icon="flash"),
            ).add_to(self.marker_cluster)
            
            if index == 100:
                break

        for index, row in realty.iterrows():
            folium.Marker(
            location=[row['point_y'], row['point_x']],
            popup=self.get_realty_popup(row),
            tooltip=row['address'],
            icon=folium.Icon(color="green", icon="star"),
            ).add_to(self.marker_points)

            if index == 100:
                break
            
        self.map.get_root().width = f"{self.width}px"
        self.map.get_root().height = f"{self.height}px"
        iframe = self.map.get_root()._repr_html_()
    
        return iframe

        
    def search_by_params(
        self,
        price_min: int = 100,
        price_max: int = 1000,
        square_min: int = 10,
        square_max: int = 100,
        floor_min: float = 1.0,
        floor_max: float = 3.0
        ):
        
        stmt = select(Reality).where(
            and_(
                Reality.lease_price.between(price_min, price_max),
                Reality.total_arena.between(square_min, square_max),
                Reality.floor.between(floor_min, floor_max),
            )
        )
        data = self.session.execute(stmt)
        data = data.scalars().all()
        print(len(data))
        return data
        
    def build_map(self):
        
        data: list[Reality] = self.search_by_params()
        
        for el in data:
        
            folium.Marker(
                location=[el.point_y, el.point_x],
                popup=self.get_realty_popup(el),
                tooltip=str(el.address),
                icon=folium.Icon(color="red", icon="flash"),
                ).add_to(self.marker_cluster)
            
        self.map.save('new_map.html')
        
        self.map.get_root().width = f"{self.width}px"
        self.map.get_root().height = f"{self.height}px"
        iframe = self.map.get_root()._repr_html_()
    
        return iframe
                
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