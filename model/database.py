import os
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

# Load environment variables
load_dotenv()

# Get database URL from environment or use default
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://egourmet:egourmet@192.168.100.145:5432/egourmet")

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session