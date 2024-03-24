import requests
from sqlalchemy import and_, or_, select, asc

import folium
from folium.plugins import MarkerCluster
from folium import FeatureGroup
from folium import plugins

import geopandas as gpd
import osmnx as ox
from geopy.distance import geodesic

from shared.models import Reality, PoiData, MetroStation, Tourist_attractions, Distance_metro, Distance_attraction
from .db import get_sync_session


class MapCreation:
    """
    Класс для создания и настройки карты с использованием библиотеки Folium.

    Атрибуты:
    - API_KEY (str): Ключ API для использования в запросах к внешним сервисам.
    - session (Session): SQLAlchemy сессия для работы с базой данных.
    - map (folium.Map): Объект карты Folium.
    - marker_cluster (folium.plugins.MarkerCluster): Группа маркеров для конкурентов.
    - metro_points (folium.FeatureGroup): Группа точек метро.
    - tourist_points (folium.FeatureGroup): Группа точек достопримечательностей.
    - marker_points (folium.FeatureGroup): Группа точек интереса.

    Методы:
    - __init__(self, location: tuple, tiles: str, zoom_start: int, min_zoom: int, max_zoom: int, cities: list[str], API_KEY: str) -> None: Инициализация класса с настройками карты.
    - add_metro(self, metro_radius: int) -> None: Добавление точек метро на карту.
    - add_tourist(self, tourist_radius: int) -> None: Добавление точек достопримечательностей на карту.
    - get_realty_popup(row: Reality) -> str: Получение HTML-попапа для объекта недвижимости.
    - get_poi_popup(poi: PoiData) -> str: Получение HTML-попапа для точки интереса.
    - validate_by_metro(self, id, metro_radius) -> bool: Проверка, находится ли объект в пределах радиуса метро.
    - validate_by_tourist(self, id, tourist_radius) -> bool: Проверка, находится ли объект в пределах радиуса достопримечательности.
    - search_by_params(self, price_min: int, price_max: int, square_min: int, square_max: int, floor_min: float, floor_max: float, segment_type_list: list[str], metro_radius: int, tourist_radius: int) -> list[Reality]: Поиск объектов недвижимости по заданным параметрам.
    - filter_favorit(self, data: list[Reality], love=[], hate=[], radius: int = 1000) -> tuple[list[Reality], list[PoiData]]: Фильтрация объектов недвижимости по предпочтениям пользователя.
    - get_coordinates(self, address) -> tuple: Получение координат по адресу.
    - get_distance_osrm(self, start_coord, end_coord) -> float: Получение расстояния между двумя координатами с использованием OSRM.
    - build_map(self, price_min: int, price_max: int, square_min: int, square_max: int, floor_min: float, floor_max: float, segment_type_list: list[str], metro_radius: int, tourist_radius: int, love: list[str], hate: list[str], select_radius: int) -> tuple[str, list[Reality]]: Сборка карты с учетом заданных параметров и фильтров.
    """
    def __init__(
        self,
        location: tuple = (59.94, 30.22),
        tiles: str = 'openstreetmap',
        zoom_start: int = 10,
        min_zoom: int = 1,
        max_zoom: int = 20,
        cities: list[str] = ['Санкт-Петербург'],
        API_KEY: str = 'b0f7dee9-c300-4505-bf42-c8c1e128a4aa'
        ) -> None:
        """
        Инициализация класса с настройками карты.

        Параметры:
        - location (tuple): Координаты центра карты.
        - tiles (str): Тип тайлов для карты.
        - zoom_start (int): Начальный уровень зума.
        - min_zoom (int): Минимальный уровень зума.
        - max_zoom (int): Максимальный уровень зума.
        - cities (list[str]): Список городов для отображения на карте.
        - API_KEY (str): Ключ API для использования в запросах к внешним сервисам.
        """
        
        self.API_KEY = API_KEY
        self.session = get_sync_session()
        
        self.map = folium.Map(
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
        self.marker_points = FeatureGroup(name='Точки интереса').add_to(self.map)

        plugins.Fullscreen().add_to(self.map)
        plugins.LocateControl().add_to(self.map)
        plugins.Draw().add_to(self.map)

        plugins.MeasureControl(position='topright',
                                primary_length_unit='meters',
                                secondary_length_unit='miles',
                                primary_area_unit='sqmeters',
                                secondary_area_unit='acres').add_to(self.map)

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
        """
        Добавление точек метро на карту.

        Параметры:
        - metro_radius (int): Радиус в метрах для определения близости к метро.
        """
        stmt = select(MetroStation)
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        for station in data:   
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
        """
        Добавление точек достопримечательностей на карту.

        Параметры:
        - tourist_radius (int): Радиус в метрах для определения близости к достопримечательностям.
        """
        stmt = select(Tourist_attractions)
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        for place in data:
            if place.lat and place.lon:
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
        """
        Получение HTML-попапа для объекта недвижимости.

        Параметры:
        - row (Reality): Объект недвижимости.

        Возвращает:
        - str: HTML-строка для попапа.
        """
        
        popup = ''
        popup += f"<p>Номер: {row.id}</p>"
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
    
    @staticmethod
    def get_poi_popup(poi: PoiData):
        """
        Получение HTML-попапа для точки интереса.

        Параметры:
        - poi (PoiData): Точка интереса.

        Возвращает:
        - str: HTML-строка для попапа.
        """
        
        popup = ''
        popup += f"<p>Номер: {poi.id}</p>"
        popup += f"<p>Название: {poi.name}</p>"
        popup += f"<p>Адрес: {poi.adress_name}</p>"
        popup += f"<p>Комментарий: {poi.addres_comment}</p>"
        popup += f"<p>Категории: {poi.rubrics}</p>"
        return popup
    
    def validate_by_metro(self, id, metro_radius: int):
        """
        Проверка, находится ли объект в пределах радиуса метро.

        Параметры:
        - id: Идентификатор объекта.
        - metro_radius (int): Радиус в метрах для определения близости к метро.

        Возвращает:
        - bool: True, если объект находится в пределах радиуса метро, иначе False.
        """
        metro_stmt = select(Distance_metro).where(Distance_metro.id_poe == id)
        
        metro = self.session.execute(metro_stmt)
        metro = metro.scalars().all()[0]
        
        if metro.distance <= metro_radius:
            return True
        
        return False 
    
    def validate_by_tourist(self, id, tourist_radius):
        """
        Проверка, находится ли объект в пределах радиуса достопримечательности.

        Параметры:
        - id: Идентификатор объекта.
        - tourist_radius (int): Радиус в метрах для определения близости к достопримечательностям.

        Возвращает:
        - bool: True, если объект находится в пределах радиуса достопримечательности, иначе False.
        """
        
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
        """
        Поиск объектов недвижимости по заданным параметрам.

        Параметры:
        - price_min (int): Минимальная цена аренды.
        - price_max (int): Максимальная цена аренды.
        - square_min (int): Минимальная площадь.
        - square_max (int): Максимальная площадь.
        - floor_min (float): Минимальный этаж.
        - floor_max (float): Максимальный этаж.
        - segment_type_list (list[str]): Список типов помещений.
        - metro_radius (int): Радиус в метрах для определения близости к метро.
        - tourist_radius (int): Радиус в метрах для определения близости к достопримечательностям.

        Возвращает:
        - list[Reality]: Список объектов недвижимости, соответствующих заданным параметрам.
        """
        
        result = list()
        
        stmt = select(Reality).where(
            and_(
                Reality.lease_price.between(price_min, price_max),
                Reality.total_arena.between(square_min, square_max),
                Reality.floor.between(floor_min, floor_max),
                Reality.segment_type.in_(segment_type_list)
            )
        ).order_by(asc(Reality.lease_price))
        
        data = self.session.execute(stmt)
        data = data.scalars().all()
        
        for el in data:
            if self.validate_by_metro(el.id, metro_radius) and self.validate_by_tourist(el.id, tourist_radius):
                result.append(el)
        return result
    
    def filter_favorit(self, data: list[Reality], love=[], hate=[], radius: int = 1000):
        """
        Фильтрация объектов недвижимости по предпочтениям пользователя.

        Параметры:
        - data (list[Reality]): Список объектов недвижимости.
        - love (list[str]): Список предпочтений пользователя.
        - hate (list[str]): Список нежелательных предпочтений пользователя.
        - radius (int): Радиус в метрах для определения близости к объектам.

        Возвращает:
        - tuple[list[Reality], list[PoiData]]: Кортеж, содержащий отфильтрованный список объектов недвижимости и список объектов, соответствующих нежелательным предпочтениям.
        """
        love_filter = or_(PoiData.rubrics.contains([rubric]) for rubric in love)
        hate_filter = or_(~PoiData.rubrics.contains([rubric]) for rubric in hate)
        combined_filter = and_(love_filter, hate_filter)
        result = self.session.query(PoiData).filter(combined_filter).all()
        
        final_data = list()
        final_res = list()
        
        for el in data[:50]:
            el_coords = [el.point_y, el.point_x]
            print(el.address)
            for sel in result:
                if geodesic(el_coords, [sel.lat, sel.lon]).meters <= radius:
                        final_res.append(sel)
                        continue
            final_data.append(el)

        return final_data, list(set(final_res))

    def get_coordinates(self, address: str):
        """
        Получение координат по адресу.

        Параметры:
        - address (str): Адрес для поиска координат.

        Возвращает:
        - tuple: Кортеж с координатами (широта, долгота).
        """
        geocode_url = f"https://geocode-maps.yandex.ru/1.x/?apikey={self.API_KEY}&geocode={address}&format=json"
        response = requests.get(geocode_url)
        response_json = response.json()
        coordinates_str = response_json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos']
        return tuple(map(float, coordinates_str.split()))

    def get_distance_osrm(self, start_coord, end_coord):
        """
        Получение расстояния между двумя координатами с использованием OSRM.

        Параметры:
        - start_coord (tuple): Кортеж с начальными координатами (широта, долгота).
        - end_coord (tuple): Кортеж с конечными координатами (широта, долгота).

        Возвращает:
        - float: Расстояние в метрах между начальной и конечной точками.
        """
        
        osrm_route_url = f"http://router.project-osrm.org/route/v1/driving/{start_coord[0]},{start_coord[1]};{end_coord[0]},{end_coord[1]}?overview=false"
        response = requests.get(osrm_route_url)
        route_data = response.json()
        
        if route_data.get("routes"):
            distance = route_data["routes"][0]["distance"]  # Расстояние в метрах
            return distance
        else:
            print("Маршрут не найден")
            return None

    def build_map(
        self,
        price_min: int = 3000,
        price_max: int = 5000,
        square_min: int = 50,
        square_max: int = 1000,
        floor_min: float = 1.0,
        floor_max: float = 10.0,
        segment_type_list: list[str] = ['Офисные', 'Производственные', 'Торговые', 'Иные'],
        metro_radius: int = 1000,
        tourist_radius: int = 1000,
        love: list[str] = ['Пекарни'],
        hate: list[str] = ['Барбершопы'],
        select_radius: int = 1000
        ):
        """
        Сборка карты с учетом заданных параметров и фильтров.

        Параметры:
        - price_min (int): Минимальная цена аренды.
        - price_max (int): Максимальная цена аренды.
        - square_min (int): Минимальная площадь.
        - square_max (int): Максимальная площадь.
        - floor_min (float): Минимальный этаж.
        - floor_max (float): Максимальный этаж.
        - segment_type_list (list[str]): Список типов помещений.
        - metro_radius (int): Радиус в метрах для определения близости к метро.
        - tourist_radius (int): Радиус в метрах для определения близости к достопримечательностям.
        - love (list[str]): Список предпочтений пользователя.
        - hate (list[str]): Список нежелательных предпочтений пользователя.
        - select_radius (int): Радиус в метрах для определения близости к объектам.

        Возвращает:
        - tuple[str, list[Reality]]: Кортеж, содержащий HTML-представление карты и список объектов недвижимости.
        """
        
        self.add_metro(metro_radius)
        self.add_tourist(tourist_radius)
        enemy_object = list()
        
        data: list[Reality] = self.search_by_params(
            price_min=int(price_min),
            price_max=int(price_max),
            square_min=int(square_min),
            square_max=int(square_max),
            floor_min=int(floor_min),
            floor_max=int(floor_max),
            segment_type_list=segment_type_list,
            metro_radius=metro_radius,
            tourist_radius=tourist_radius
        )
        
        if love and hate:
            data, enemy_object = self.filter_favorit(data=data, love=love, hate=hate, radius=select_radius)
        
        for index, el in enumerate(data):
        
            folium.Marker(
                location=[el.point_y, el.point_x],
                popup=self.get_realty_popup(el),
                tooltip=str(el.address),
                icon=folium.Icon(color="purple" if index < 5 else 'green', icon="flash"),
                ).add_to(self.marker_points)
            
            folium.Circle(
                location=[el.point_y, el.point_x],
                radius=select_radius,
                color="blue",
                weight=1,
                fill_opacity=0.1,
                opacity=0.5,
                fill_color="purple" if index < 5 else 'green',
                fill=False,
            ).add_to(self.marker_points)
            
        for obj in enemy_object:
            folium.Marker(
                location=[obj.lat, obj.lon],
                popup=self.get_poi_popup(obj),
                tooltip=str(obj.adress_name),
                icon=folium.Icon(color="red", icon="fire"),
                ).add_to(self.marker_cluster)
        
        iframe = self.map.get_root()._repr_html_()
        return iframe, data
