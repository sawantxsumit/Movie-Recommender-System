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
| **Modern UI/UX** | Built with high-contrast, dark-mode CSS and includes a loading spinner/text for a smooth user experience. |

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

### 1. Clone the Repository

```bash
git clone [YOUR GITHUB REPO URL]
cd [REPO FOLDER NAME]
