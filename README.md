# 🎬 Movie Recommendation System

## ✨ Live Demo

**Live Application URL:** 👉 https://movie-recommendation-system-952o.onrender.com |

---

## 🌟 Overview

This project implements a **Content-Based Movie Recommendation System** using Flask for the backend, powered by Scikit-learn's TFIDF vectorization and Cosine Similarity. The system uses movie metadata (genres, keywords, cast, crew, and overview) to find movies that are mathematically similar to a user's selected movie.

The modern front-end allows users to search case-insensitively and provides rich details for recommended movies by fetching real-time data from The Movie Database (TMDB) API.

## 🚀 Core Features

| Feature | Description |
| :--- | :--- |
| **Content-Based Filtering** | Leverages movie metadata (tags) to compute similarity, offering highly relevant recommendations. |
| **Efficient Model Handling** | Uses `similarity.pkl` (Cosine Similarity matrix) and `movies.pkl` (DataFrame) for fast, low-latency recommendations. |
| **Live Details Modal** | Clicking any poster opens a detailed modal with real-time data fetched from TMDB, including **Release Date**, **Runtime**, **Rating**, and **Overview**. |
| **Case-Insensitive Search** | Users can search for movie titles in any case (e.g., "batman" works for "Batman"). |
| **Modern UI/UX** | Built with high-contrast, dark-mode CSS and ensures a smooth user experience. |

---

## 🧠 Technical Methodology

The recommendation logic is based on:

1.  **Data Preparation:** The raw movie data (from TMDB 5000) is pre-processed, combining `overview`, `genres`, `keywords`, `cast`, and `crew` into a single, clean `tags` column.
2.  **Feature Extraction (TFIDF):** The combined `tags` column is transformed into a matrix of numbers using **TFIDF (Term Frequency-Inverse Document Frequency)**. This technique weighs the importance of unique words in the movie descriptions.
3.  **Similarity Calculation (Cosine Similarity):** The final step calculates the **Cosine Similarity** between every movie vector. This generates a matrix (`similarity.pkl`) where each cell represents the similarity score between two movies.

When a user searches for a movie, the system retrieves the row corresponding to that movie from the similarity matrix, sorts the scores, and returns the top 10 most similar movie titles.

---

## ⚙️ Local Setup and Installation

Follow these steps to set up and run the project locally.

### Prerequisites

* Python 3.x
* A free **TMDB API Key** (required for fetching live movie posters and details).

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/sawantxsumit/fake-news-detector.git
    cd fake-news-detector
    ```


 2. **Create and Activate Virtual Environment**
```bash
python -m venv venv
On Windows:
.\venv\Scripts\activate

On macOS/Linux:
source venv/bin/activate
```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4. **Configure API Key (Crucial!)**
For the app to fetch movie posters and details, you must set your TMDB API Key as an environment variable.

```bash
Linux/macOS:
export TMDB_API_KEY='YOUR_TMDB_API_KEY'

Windows (Command Prompt):
set TMDB_API_KEY=YOUR_TMDB_API_KEY
```

5. **Run the Application**
```
Start the Flask development server:
python app.py

The application will be available at: http://127.0.0.1:5000/
```

## 🛠️ Deployment
The application is deployed on Render using the configuration below:

**Runtime:** Python 3

**Build Command:** pip install -r requirements.txt

**Start Command:** gunicorn app:app

**Environment Variables:** TMDB_API_KEY (set securely on the platform)


## 📂 Project Structure
```text
.
├── app.py                  # Main Flask application.
├── movie_recommeder.py     # Core recommendation and API fetching logic.
├── requirements.txt        # Python dependencies (Flask, scikit-learn, etc.).
├── model/                  
│   ├── movies.pkl          # Pre-processed movie data (title, tags, etc.).
│   └── similarity.pkl      # Cosine Similarity matrix (The ML model).
├── notebooks/
│   └── model_traning.ipynb # Jupyter Notebook detailing data cleaning and modeling.
├── templates/
│   └── index.html          # Frontend HTML structure.
└── static/
    ├── style.css           # Client-side CSS for the modern UI/UX.
    └── script.js           # Client-side logic for search, UI, and modal handling. 
