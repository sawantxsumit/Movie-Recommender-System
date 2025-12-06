from flask import Flask , render_template , request, redirect , url_for , jsonify
import pickle
from movie_recommeder import recommend_top10

app= Flask(__name__)

movies_list=pickle.load(open('model/movies.pkl','rb'))
movie_names=pickle.load(open('model/movies.pkl','rb'))
MOVIE_NAMES = movies_list['title'].tolist()
print(len(MOVIE_NAMES))

similarity=pickle.load(open('model/similarity.pkl', 'rb'))
print('Models loaded successfully')


########################################################################
# Default endpoint 
# renders the frontend
#######################################################################
@app.route('/', methods=['GET', 'POST'])
def recommneder_system():
    if request.method=='GET':
        return render_template('index.html', movie_names=MOVIE_NAMES)
    
########################################################################
# This endpoint accepts {movie_title and count} as json via POST 
# calls recommend_top10(movie) which returns title_list and poster_list
# And lastly we will zip them into uniform list of objects
#######################################################################
@app.route('/recommend', methods=['POST'])
def recommneder_endpoint():
    payload= request.get_json() # get incoming json
    movie_name= payload.get('movie','').strip()
    count= int(payload.get('count', 10))
    
    if not movie_name:
        return jsonify({'Error':'Enter a valid movie name'}) , 400
    
    titles, details= recommend_top10(movie_name)
    
    if not titles:
        return jsonify({'Error': 'Movie not found in database'}), 404
    n= min(len(titles) , len(details), count)
    # Ensures we only return the user-requested number.
    result=[]
    for i in range(n):
        # Handle case where API might fail (None)
        movie_data = details[i] if details[i] else {}
        
        result.append({
            'title': titles[i],
            'poster': movie_data.get('poster'),
            'overview': movie_data.get('overview'),
            'rating': movie_data.get('rating'),
            'date': movie_data.get('date'),
            'runtime': movie_data.get('runtime'),
            'genres': movie_data.get('genres')
        })
        
    return jsonify(result)


@app.route('/search_movies')
def search_movies():
    q = request.args.get('q','').lower()
    if not q:
        return jsonify([])
    matches = [m for m in movies_list if m.lower().startswith(q)][:50]
    return jsonify(matches)

    
if __name__=='__main__':
    app.run(debug=True)