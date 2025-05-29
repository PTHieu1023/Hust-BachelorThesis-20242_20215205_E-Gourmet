from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

engine = create_engine("postgresql://postgres:postgres@localhost:5432/postgres", echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session