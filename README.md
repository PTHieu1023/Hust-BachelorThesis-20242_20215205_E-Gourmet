# E-Gourmet Recommendation Service

A FastAPI-based recommendation service using Semi-Supervised Fuzzy C-Means (SSFCM) clustering algorithm for personalized dish recommendations.

## Features

- **SSFCM Clustering**: Uses semi-supervised fuzzy clustering to group dishes based on user preferences
- **Personalized Recommendations**: Generates dish recommendations based on user interaction history
- **Real-time API**: FastAPI endpoints for generating and retrieving recommendations
- **Background Processing**: Asynchronous recommendation generation for better performance
- **Database Integration**: PostgreSQL integration with SQLModel ORM

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### 2. Database Setup

Make sure your PostgreSQL database is running and accessible with the credentials in your `.env` file.

The service will automatically create the necessary tables on startup.

### 3. Run the Service

```bash
# Start the recommendation service
python run.py
```

The service will be available at `http://localhost:8000`

### 4. API Documentation

- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

### GET `/api/recommend/{user_id}`
Get stored recommendations for a specific user.

**Parameters:**
- `user_id`: User ID to get recommendations for
- `limit`: Number of recommendations to return (default: 10)

**Response:**
```json
{
  "user_id": "user-123",
  "recommendations": [
    {
      "dish_id": 1,
      "score": 0.85,
      "dish_name": "Margherita Pizza",
      "price": 12.50,
      "description": "Classic Italian pizza...",
      "cuisine_name": "Italian",
      "restaurant_name": "Mario's Pizzeria",
      "restaurant_avatar": "https://...",
      "avg_rating": 4.5,
      "review_count": 23
    }
  ]
}
```

### POST `/api/recommend/generate/{user_id}`
Generate new recommendations for a specific user using SSFCM clustering.

**Parameters:**
- `user_id`: User ID to generate recommendations for

**Response:**
```json
{
  "message": "Recommendation generation started for user user-123"
}
```

### POST `/api/recommend/generate-all`
Generate recommendations for all active users with interaction history.

**Response:**
```json
{
  "message": "Recommendation generation started for all users"
}
```

## Testing

### Run Tests

```bash
# Make sure the service is running first
python run.py

# In another terminal, run tests
python test_recommendations.py
```

### Sample Data

To test with sample data:

```bash
python insert_sample_data.py
```

This will populate your database with sample users, dishes, restaurants, cuisines, reviews, and interactions.

## Algorithm Details

### SSFCM (Semi-Supervised Fuzzy C-Means)

The recommendation engine uses SSFCM clustering with the following approach:

1. **Feature Extraction**: Extracts features from dishes (price, cuisine, rating, popularity) and users (budget, preferences)

2. **Supervised Matrix**: Creates supervision based on user's historical interactions:
   - High ratings (≥4): Cluster 0 (Highly liked)
   - Medium ratings (3): Cluster 1 (Moderately liked) 
   - Low ratings (1-2): Cluster 4 (Disliked)
   - Views without rating: Cluster 2 (Viewed)

3. **Clustering**: Runs SSFCM with 5 clusters, fuzziness parameter 2.0

4. **Scoring**: Combines cluster membership with dish quality, popularity, and budget compatibility

5. **Storage**: Updates the `user_recommendation` table with top 20 recommendations per user

### Configuration

Key parameters can be configured via environment variables:

- `RECOMMENDATION_CLUSTERS`: Number of clusters (default: 5)
- `RECOMMENDATION_FUZZINESS`: Fuzziness parameter (default: 2.0)
- `RECOMMENDATION_MAX_ITERATIONS`: Max iterations (default: 100)
- `RECOMMENDATION_TOP_COUNT`: Top recommendations per user (default: 20)

## Database Schema

The service expects the following tables:

- `users`: User information with budget preferences
- `dishes`: Dish details with price, cuisine, restaurant
- `cuisines`: Cuisine categories
- `restaurants`: Restaurant information
- `reviews`: User ratings and reviews for dishes
- `user_interactions`: User interactions with dishes (views, clicks)
- `user_recommendation`: Generated recommendations (managed by service)

## Development

### Project Structure

```
be-rcm/
├── main.py                 # FastAPI application
├── run.py                  # Server startup script
├── recommendation_engine.py # Core recommendation logic
├── requirements.txt        # Python dependencies
├── .env                    # Environment configuration
├── model/
│   ├── model.py           # SQLModel data models
│   └── database.py        # Database connection
├── utils/
│   └── clustering/
│       ├── ssfcm.py       # SSFCM implementation
│       └── data_processor.py # Data normalization
└── test_recommendations.py # Test suite
```

### Adding New Features

1. **New Clustering Algorithms**: Implement in `utils/clustering/`
2. **New Features**: Add to feature extraction in `RecommendationEngine`
3. **New Endpoints**: Add to `main.py` following existing patterns

## Performance Considerations

- **Background Processing**: Recommendation generation runs in background tasks
- **Batch Processing**: Use `/generate-all` for bulk recommendation updates
- **Caching**: Recommendations are stored in database for fast retrieval
- **Incremental Updates**: Generate recommendations only for users with new interactions

## Monitoring and Logging

The service provides detailed logging for:
- Recommendation generation progress
- Clustering performance
- Database operations
- API requests and errors

Check logs for debugging and monitoring system performance.

## 🎉 Implementation Status

**✅ COMPLETED - Production Ready**

The E-Gourmet Recommendation System is now fully implemented and tested:

### ✅ Core Features Implemented:
- SSFCM (Semi-Supervised Fuzzy C-Means) clustering algorithm
- Real-time recommendation generation for individual users
- Bulk recommendation generation for all users
- RESTful API endpoints with FastAPI
- PostgreSQL database integration with proper schema matching
- Background task processing for scalability

### ✅ Technical Achievements:
- Fixed null value insertion bug in `user_recommendation` table
- Implemented robust Decimal-to-float conversion for database fields
- Added comprehensive error handling and logging
- Created complete test suite with sample data
- Optimized clustering algorithm performance
- Database connection management with environment variables

### ✅ Testing & Validation:
- All API endpoints working correctly
- System health checks passing
- Sample data insertion and retrieval verified
- Integration tests with multiple users
- Performance testing completed

### 🔧 Available Scripts:
- `python run.py` - Start the recommendation service
- `python test_recommendations.py` - Run API endpoint tests
- `python final_test.py` - Comprehensive integration test
- `python check_system.py` - System health verification
- `python insert_sample_data.py` - Insert test data
- `python debug_db.py` - Database debugging utility

### 📊 Live Documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**The recommendation system is ready for production use!**
