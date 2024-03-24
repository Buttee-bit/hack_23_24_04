from pydantic import BaseModel
from typing import List

class CustomMapView(BaseModel):
    price_min: int
    price_max: int
    square_min: int
    square_max: int
    floor_min: float
    floor_max: float
    segment_type_list: List[str]
    metro_radius: int
    tourist_radius: int
    hate: List[str]
    love: List[str]
    select_radius: int