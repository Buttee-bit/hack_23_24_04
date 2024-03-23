from pathlib import Path
import sys
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import and_,delete, desc, func, insert, select, update
from sqlalchemy.orm import selectinload
from ..datebase import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession

from .geo_market.map_creation import MapCreation


from ..models import PoiData

map = MapCreation()

router = APIRouter (
    prefix='/custom_view',
    tags= ['custom_view']
)


@router.get('/custom_map')
async def custom_map():
    iframe = map.visualize_polygons_all_data()
    return iframe

# def visualize_polygons(geometry):

#     # map = folium.Map(location=(59.6683027, 30.0650571), zoom_start=10, tiles='cartodbpositron')

#     map = folium.Map(
#             width=1400,
#             height=900,
#             location=(59.94, 30.22),
#             tiles='openstreetmap',
#             zoom_start=10,
#             min_zoom=1,
#             max_zoom=20)

#     plugins.Geocoder().add_to(map)

#     fmtr = "function(num) {return L.Util.formatNum(num, 3) + ' º ';};"
#     plugins.MousePosition(
#         position="topright",
#         separator=" | ",
#         prefix="Coordinates:",
#         lat_formatter=fmtr,
#         lng_formatter=fmtr).add_to(map)

#     minimap = plugins.MiniMap()
#     map.add_child(minimap)

#     overlay = gpd.GeoSeries(geometry).to_json()
#     folium.GeoJson(overlay, name = 'boundary').add_to(map)

#     marker_cluster = MarkerCluster(name='Конкуренты').add_to(map)
#     marker_points = FeatureGroup(name='Точки интереса', show=False).add_to(map)

#     plugins.Fullscreen().add_to(map)
#     plugins.LocateControl().add_to(map)
#     plugins.Draw().add_to(map)

#     plugins.MeasureControl(position='topright',
#                             primary_length_unit='meters',
#                             secondary_length_unit='miles',
#                             primary_area_unit='sqmeters',
#                             secondary_area_unit='acres').add_to(map)

#     folium.TileLayer('Stamen Terrain').add_to(map)
#     folium.TileLayer('Stamen Watercolor').add_to(map)
#     folium.TileLayer('cartodbpositron').add_to(map)
#     folium.TileLayer('cartodbdark_matter').add_to(map)
#     folium.TileLayer('openstreetmap').add_to(map)

#     folium.TileLayer(
#         tiles='https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
#         attr='OpenRailwayMap',
#         name='OpenRailwayMap'
#     ).add_to(map)

#     folium.TileLayer(
#         tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
#         attr='Esri',
#         name='Esri Satellite',
#         overlay=False,
#         control=True
#     ).add_to(map)

#     folium.LayerControl().add_to(map)

#     for index, row in poi.iterrows():

#         folium.Marker(
#         location=[row['lat'], row['lon']],
#         popup=get_poi_popup(row),
#         # tooltip=str(row['name']),
#         icon=folium.Icon(color="red", icon="flash"),
#         ).add_to(marker_cluster)

#         if index == 100:
#             break


#     for index, row in realty.iterrows():
#         folium.Marker(
#         location=[row['point_y'], row['point_x']],
#         popup=get_realty_popup(row),
#         tooltip=row['address'],
#         icon=folium.Icon(color="green", icon="star"),
#         ).add_to(marker_points)

#         if index == 100:
#             break

#     return map

# # выводим центроиды полигонов
# def get_lat_lon(geometry):

#     lon = geometry.apply(lambda x: x.x if x.type == 'Point' else x.centroid.x)
#     lat = geometry.apply(lambda x: x.y if x.type == 'Point' else x.centroid.y)
#     return lat, lon

# # выгрузим границы Краснодара из OSM
# cities = ['Санкт-Петербург']
# polygon_krd = ox.geometries_from_place(cities, {'boundary':'administrative'}).reset_index()
# polygon_krd = polygon_krd[(polygon_krd['name'] == 'Санкт-Петербург')]
# # посмотрим что получилось
# visualize_polygons(polygon_krd['geometry'])

