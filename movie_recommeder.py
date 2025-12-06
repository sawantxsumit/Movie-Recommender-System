import pickle
import requests

movies=pickle.load(open('model/movies.pkl','rb'))
similarity=pickle.load(open('model/similarity.pkl', 'rb'))
print('Models loaded successfully')

def recommend_top10(movie: str):
    '''
    This function returns titles and detailed info for 10 similar movies.
    '''
    try:
        movie_index = movies[movies['title'] == movie].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:11]
        
        recommended_titles = []
        recommended_details = []

        for i in movies_list:
            movie_row = movies.iloc[i[0]]
            movie_id = movie_row.movie_id
            
            # Add Title
            recommended_titles.append(movie_row.title)
            
            # Fetch ALL details from API using the updated function
            details = fetch_movie_details(movie_id)
            recommended_details.append(details)

        return recommended_titles, recommended_details
        
    except IndexError:
        return [], []

def fetch_movie_details(movie_id):
    '''
    This function takes movie_id and returns a dictionary of details 
    (poster, overview, rating, genres, etc.) matching your existing logic.
    '''
    url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key=66e83890e4e9117150ef58f81296e512&language=en-US'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        # 1. Poster Path
        poster_url = None
        if 'poster_path' in data and data['poster_path']:
            poster_url = f"https://image.tmdb.org/t/p/w500/{data['poster_path']}"
            
        # 2. Genres (Extract names and join them)
        genres = [g['name'] for g in data.get('genres', [])][:3] # Limit to top 3
        
        # 3. Runtime (Convert minutes to Xh Ym)
        runtime_min = data.get('runtime', 0)
        runtime_str = f"{runtime_min // 60}h {runtime_min % 60}m" if runtime_min else "N/A"

        # 4. Release Date (Year only)
        date = data.get('release_date', 'N/A')
        year = date.split('-')[0] if date else 'N/A'

        # Return all details as a dictionary
        return {
            'poster': poster_url,
            'overview': data.get('overview', 'No overview available.'),
            'rating': round(data.get('vote_average', 0), 1),
            'date': year,
            'runtime': runtime_str,
            'genres': ", ".join(genres)
        }
    else:
        print(f"Error fetching details for movie ID {movie_id}: Status Code {response.status_code}")
        return None



