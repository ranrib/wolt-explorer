import requests
import json


def get_resteraunts(event, context):
    with open('out.json') as google_data_file:
        google_data = json.loads(google_data_file.read())
    response = requests.get(
        'https://restaurant-api.wolt.com/v1/pages/restaurants?'
        f'lat={event["queryStringParameters"]["lat"]}&'
        f'lon={event["queryStringParameters"]["lon"]}'
    ).json()
    for resteraunt in response['sections'][1]['items']:
        resteraunt['google'] = google_data.get(resteraunt['track_id'], {})
    return {
        "statusCode": 200,
        "body": json.dumps(response),
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
    }
