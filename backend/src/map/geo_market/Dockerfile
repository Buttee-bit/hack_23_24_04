FROM python:3.11-slim-buster as geo_maker
COPY ../geo_market/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt
RUN apt-get update


COPY ../shared/requirements.txt /shared/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /shared/requirements.txt

FROM geo_maker
COPY ../geo_market /app/geo_market
COPY ../shared /app/shared
ENV PYTHONPATH "${PYTHONPATH}:/app"
WORKDIR /app/geo_market
