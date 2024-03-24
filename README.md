# hack_23_24_04
CASE 1
Инструкция по запуску проекта:
1. git clone https://github.com/Buttee-bit/hack_23_24_04.git
2. docker compose --env-file .env.dev --profile deploy up --build -d
3. Переходим по адрессу: http://localhost:8000/docs
4. Последовательно выполняем запросы : POST http://localhost:8000//insert_data/data_poi, POST http://localhost:8000//insert_data/data_reality, POST http://localhost:8000//insert_data/data_metro, POST http://localhost:8000//insert_data/data_tourist_attraction, POST http://localhost:8000//insert_data/distance_attraction, POST http://localhost:8000//insert_data/distance_metro

5. Переходим по адресу: http://localhost:3000/
Пользуемся решением !
