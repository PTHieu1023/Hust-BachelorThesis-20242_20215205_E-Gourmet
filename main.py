from contextlib import asynccontextmanager

from fastapi import FastAPI
from routers import recommend

import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(_: FastAPI):
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(recommend.router)
