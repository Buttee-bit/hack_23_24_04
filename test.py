import requests

API_KEY = 'b0f7dee9-c300-4505-bf42-c8c1e128a4aa'
address1 = "Санкт-Петербург, проспект Королёва, 47к1"
address2 = "Санкт-Петербург, Комендантский просп., 12"


def get_coordinates(address):
    geocode_url = f"https://geocode-maps.yandex.ru/1.x/?apikey={API_KEY}&geocode={address}&format=json"
    response = requests.get(geocode_url)
    response_json = response.json()
    coordinates_str = response_json['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['Point']['pos']
    return tuple(map(float, coordinates_str.split()))




def get_distance_osrm(start_coord, end_coord):
    osrm_route_url = f"http://router.project-osrm.org/route/v1/driving/{start_coord[0]},{start_coord[1]};{end_coord[0]},{end_coord[1]}?overview=false"
    response = requests.get(osrm_route_url)
    route_data = response.json()
    
    if route_data.get("routes"):
        distance = route_data["routes"][0]["distance"]  # Расстояние в метрах
        return distance
    else:
        print("Маршрут не найден")
        return None


coordinates1 = get_coordinates(address1)
coordinates2 = get_coordinates(address2)


print(f"Координаты {address1}: {coordinates1}")
print(f"Координаты {address2}: {coordinates2}")

start_coord = (coordinates1)  
end_coord = (coordinates2) 

distance = get_distance_osrm(start_coord, end_coord)
if distance:
    print(f"Расстояние по дорогам: {distance / 1000:.2f} км")
else:
    print("Error")

