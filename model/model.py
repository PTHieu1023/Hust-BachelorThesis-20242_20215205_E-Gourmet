from sqlmodel import SQLModel, Field
from typing import Optional


class Dish(SQLModel, table=True):
    __tablename__ = 'Dish'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    cuisineId: int = Field(foreign_key="Cuisine.id")
    price: float

    def __repr__(self):
        return f"<Dish(name={self.name}, price={self.price})>"

class Cuisine(SQLModel, table=True):
    __tablename__ = 'Cuisine'
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    def __repr__(self):
        return f"<Cuisine(name={self.name})>"

class User(SQLModel, table=True):
    __tablename__ = 'User'
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    email: str
    def __repr__(self):
        return f"<User(username={self.username}, email={self.email}, age={self.age}, budget={self.budget})>"

class UserInteraction(SQLModel, table=True):
    __tablename__ = 'UserInteraction'
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: int = Field(foreign_key="User.id")
    dishId: int = Field(foreign_key="Dish.id")
    interactionType: str  # e.g., 'view', 'like', 'order'
    timestamp: Optional[str] = None  # ISO format date string

    def __repr__(self):
        return f"<UserInteraction(userId={self.userId}, dishId={self.dishId}, interactionType={self.interactionType}, timestamp={self.timestamp})>"

class UserRecommendation(SQLModel, table=True):
    __tablename__ = 'UserRecommendation'
    id: Optional[int] = Field(default=None, primary_key=True)
    userId: int = Field(foreign_key="User.id")
    dishId: int = Field(foreign_key="Dish.id")
    score: float

    def __repr__(self):
        return f"<UserRecommendation(userId={self.userId}, dishId={self.dishId}, score={self.score})>"

class Review(SQLModel, table=True):
    __tablename__ = 'Review'
    id: Optional[int] = Field(default=None, primary_key=True)
    dishId: int = Field(foreign_key="Dish.id")
    userId: int = Field(foreign_key="User.id")
    rating: int
    comment: Optional[str] = None

    def __repr__(self):
        return f"<Review(dishId={self.dishId}, userId={self.userId}, rating={self.rating}, comment={self.comment})>"