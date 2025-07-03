from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Dish(SQLModel, table=True):
    __tablename__ = 'dishes'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    price: int  # Price in cents
    cuisine_id: int = Field(foreign_key="cuisines.id")
    restaurant_id: int = Field(foreign_key="restaurants.id")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __repr__(self):
        return f"<Dish(name={self.name}, price={self.price})>"


class Cuisine(SQLModel, table=True):
    __tablename__ = 'cuisines'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    parent_id: Optional[int] = Field(default=None, foreign_key="cuisines.id")
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __repr__(self):
        return f"<Cuisine(name={self.name})>"


class User(SQLModel, table=True):
    __tablename__ = 'users'
    id: str = Field(primary_key=True)  # String ID as per schema
    username: str
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    budget: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    enable: bool = True

    def __repr__(self):
        return f"<User(username={self.username}, email={self.email})>"


class Restaurant(SQLModel, table=True):
    __tablename__ = 'restaurants'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    username: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_approved: Optional[bool] = False

    def __repr__(self):
        return f"<Restaurant(name={self.name}, username={self.username})>"


class UserInteraction(SQLModel, table=True):
    __tablename__ = 'user_interactions'
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    dish_id: int = Field(foreign_key="dishes.id")
    interaction_score: Optional[int] = 1
    created_at: Optional[datetime] = None

    def __repr__(self):
        return f"<UserInteraction(user_id={self.user_id}, dish_id={self.dish_id}, score={self.interaction_score})>"


class UserRecommendation(SQLModel, table=True):
    __tablename__ = 'user_recommendation'
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    dish_id: int = Field(foreign_key="dishes.id")
    score: float
    created_at: Optional[datetime] = None

    def __repr__(self):
        return f"<UserRecommendation(user_id={self.user_id}, dish_id={self.dish_id}, score={self.score})>"


class Review(SQLModel, table=True):
    __tablename__ = 'reviews'
    id: Optional[int] = Field(default=None, primary_key=True)
    dish_id: int = Field(foreign_key="dishes.id")
    user_id: str = Field(foreign_key="users.id")
    rating: int
    comment: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __repr__(self):
        return f"<Review(dish_id={self.dish_id}, user_id={self.user_id}, rating={self.rating})>"