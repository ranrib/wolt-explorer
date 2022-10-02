import requests
import json

def get_resteraunts():
    key = open('key.txt').read()
    response = requests.get(
        'https://restaurant-api.wolt.com/v1/pages/restaurants?lat=32.0633549&lon=34.769285'
    ).json()
    gscores = {}

    for rest in response['sections'][1]['items']:
        name = rest['venue']['name'].split(' | ')[0]
        address = rest['venue']['address']
        track_id = rest['track_id']
        lat = rest['venue']['location'][1]
        lon = rest['venue']['location'][0]
        rest_res = requests.get(
            f'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Cprice_level&input={name}&inputtype=textquery&locationbias=point%3A{lat}%2C{lon}&key={key}'
        ).json()

        if len(rest_res['candidates']) == 0:
            print('didnt find', name)
            continue

        rest_res = rest_res['candidates'][0]

        print(name, address, '==', rest_res['name'], rest_res['formatted_address'])

        price = rest_res.get('price_level')
        rating = rest_res.get('rating')
        if not price and not rating: continue
        gscores[track_id] = {}
        if price:
            gscores[track_id]['p'] = price
        if rating:
            gscores[track_id]['r'] = rating
    
        with open('out.json', 'w') as out_file:
            out_file.write(json.dumps(gscores))
    import ipdb;ipdb.set_trace()

get_resteraunts()