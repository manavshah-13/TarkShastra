# TarkShastra Complaint Management Backend

FastAPI-based backend for a modern complaint management system with AI classification and explainability.

## Features
- **Authentication**: JWT-based login, refresh, and role-based access control (Admin, Manager, User).
- **Complaint Management**: CRUD operations with AI-driven category and priority prediction.
- **AI Integration**: Scikit-learn model for classification and SHAP for explainability.
- **Batch Processing**: CSV upload for bulk complaint processing.
- **Analytics**: Dashboard statistics and time-series trends.
- **Real-time Updates**: SSE-based streaming for dashboard live updates.
- **Admin Tools**: User management and workload monitoring.

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI/ML**: scikit-learn, SHAP, pandas
- **Real-time**: SSE (Server-Sent Events)
- **Security**: Jose (JWT), Passlib (Bcrypt)

## Setup

1. **Clone the repository**:
   ```bash
   cd ts14-backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   Create a `.env` file (see `.env` template) with your `DATABASE_URL` and `SECRET_KEY`.

4. **Initialize Database**:
   The app will automatically create tables on startup if they don't exist.

5. **Train Dummy Model** (for testing):
   ```bash
   python train_model.py
   ```

6. **Run the application**:
   ```bash
   python -m uvicorn main:app --reload
   ```

## API Documentation
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
