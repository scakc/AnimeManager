from flask import Flask, request, jsonify, send_from_directory, render_template
import requests
from bs4 import BeautifulSoup
import os
import json

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scrapelucifer', methods=['POST'])
def scrapelucifer():
    data = request.get_json()
    url = data.get('url')
    print(f'URL: {url}')

    return_data = {}

    htmlUrl = requests.get(url)
    soup = BeautifulSoup(htmlUrl.content, 'html.parser')

    # Extract the name using the class 'entry-title'
    className = 'entry-title'
    name_element = soup.find(class_=className)
    if name_element:
        name = name_element.text
        return_data['name'] = name
    else:
        return_data['name'] = 'Not found'

    # Extract the rating using the class 'rating'
    rating_class = 'rating'
    rating_element = soup.find(class_=rating_class)
    if rating_element:
        rating = rating_element.text
        print(f'Rating: {rating}')
        return_data['rating'] = float(rating.split(' ')[-1])
    else:
        return_data['rating'] = 10.0

    # Extract the image using the class 'thumb'
    thumb_class = 'thumb'
    thumb_element = soup.find(class_=thumb_class)
    if thumb_element and thumb_element.find('img'):
        image_src = thumb_element.find('img')['src']
        print(f'Image src: {image_src}')
        return_data['image'] = image_src
    else:
        return_data['image'] = 'Not found'

    return jsonify(return_data)

@app.route('/api/scrapegogo', methods=['POST'])
def scrapegogo():
    data = request.get_json()
    url = data.get('url')
    print(f'URL: {url}')

    return_data = {}

    htmlUrl = requests.get(url)
    soup = BeautifulSoup(htmlUrl.content, 'html.parser')

    # Extract the name using the class 'anime_info_body_bg'
    className = 'anime_info_body_bg'
    name_element = soup.find(class_=className)
    if name_element:
        # h1 text is the name of the anime
        name = name_element.find('h1').text
        return_data['name'] = name
    else:
        return_data['name'] = 'Not found'

    # Extract the rating using the class 'rating'
    return_data['rating'] = 8.0

    # Extract the image using the class 'anime_info_body_bg'
    thumb_class = 'anime_info_body_bg'
    thumb_element = soup.find(class_=thumb_class)
    if thumb_element and thumb_element.find('img'):
        # Extract the root url from the current url, i.e. http://**/ as rooturl
        image_src = thumb_element.find('img')['src']
        if "http" not in image_src:
            rooturl = url.split('/')[0] + '//' + url.split('/')[2] + '/'
            image_src = rooturl + thumb_element.find('img')['src']
        print(f'Image src: {image_src}')
        return_data['image'] = image_src
    else:
        return_data['image'] = 'Not found'

    return jsonify(return_data)

@app.route('/api/saveLocalStorage', methods=['POST'])
def save():
    print('Saving to local storage')
    data = request.get_json()
    # save to file system with the name 'animelist.json'
    with open('saves/animelist.json', 'w') as file:
        json.dump(data, file)
    
    return jsonify({'message': 'Saved successfully'})

@app.route('/api/loadLocalStorage', methods=['GET'])
def load():
    # load from file system with the name 'animelist.json'
    print('Loading from local storage')
    try:
        with open('saves/animelist.json', 'r') as file:
            data = json.load(file)
    except FileNotFoundError:
        data = {}
    
    return jsonify({'data': data})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)