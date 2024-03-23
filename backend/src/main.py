from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .test.router import router as test_router



app = FastAPI(
    title="HACK API"
)


app.add_middleware(SessionMiddleware, secret_key="secret-string")

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost:3000",
    "https://1cc641400201.vps.myjino.ru",
    "http://81.177.141.245:8000",
    "http://81.177.141.245"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allow_headers=["Content-Type", "Access-Control-Allow-Headers",
                   "Access-Control-Allow-Origin", "Authorization"],
)

app.include_router(test_router)