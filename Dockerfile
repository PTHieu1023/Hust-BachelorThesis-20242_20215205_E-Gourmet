# Use the latest Python 3.13 Alpine image for a smaller size
FROM python:3.13-alpine

# Set environment variables for faster & cleaner installs
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_ROOT_USER_ACTION=ignore

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the application port
EXPOSE 8000

# Use a non-root user for security (optional)
RUN adduser -D fastapi
USER fastapi

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
