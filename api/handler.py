import requests


def get_resteraunts(event, context):
    return {
        "statusCode": 200,
        "body": requests.get(
            'https://restaurant-api.wolt.com/v1/pages/restaurants?'
            f'lat={event["queryStringParameters"]["lat"]}&'
            f'lon={event["queryStringParameters"]["lon"]}'
        ).text,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET"
        },
    }
