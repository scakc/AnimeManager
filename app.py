import http.server
import requests
from bs4 import BeautifulSoup
import json
PORT = 8000

class AnimeManager(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    # another get method
    def do_POST(self):
        print('POST request received')
        data = self.rfile.read(int(self.headers['Content-Length']))
        decodedData = data.decode('utf-8')
        url = json.loads(decodedData)['url']
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

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(return_data).encode('utf-8'))
        
httpd = http.server.HTTPServer(('localhost', PORT), AnimeManager)
print(f'Serving at http://localhost:{PORT}')

httpd.serve_forever()
    