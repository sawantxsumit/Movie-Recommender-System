import pickle
import requests

movies=pickle.load(open('model/movies.pkl','rb'))
similarity=pickle.load(open('model/similarity.pkl', 'rb'))
print('Models loaded successfully')


def recommend_top10(movie:str)->list[str]:
    '''
    This functions returns a list a 10 similar movies to the given movie name.
    
    :param movie: Movie title
    '''
    movie_index= movies[movies['title']== movie].index[0]
    distances= similarity[movie_index]
    movies_list= sorted(list(enumerate(distances)), reverse=True , key=lambda x:x[1])[1:11]
    recommended_movies=[]
    recommended_movies_posters=[]
    for i in movies_list:
        movie_id=movies.iloc[i[0]].movie_id
        recommended_movies.append(movies.iloc[i[0]].title)
        # fetch the movie posters from api
        recommended_movies_posters.append(fetch_poster(movie_id))
    return recommended_movies, recommended_movies_posters


def fetch_poster(movie_id:str):
    '''
    This functions takes movie id as argument and returns the poster for that movie.
    
    :param movie_id: Unique movie ID
    '''
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key=66e83890e4e9117150ef58f81296e512&language=en-US')
    if response.status_code == 200:
        data = response.json()
        if 'poster_path' in data and data['poster_path']:
            return f"https://image.tmdb.org/t/p/w500/{data['poster_path']}"
        else:
            return None # Return None if no poster path is found
    else:
        print(f"Error fetching poster for movie ID {movie_id}: Status Code {response.status_code}")
        return None # Return None on API failure


