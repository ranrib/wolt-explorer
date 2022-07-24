import React from 'react';
import './App.css';

function RandomRestaurant(props) {
  const { filteredResteraunts, idx } = props;
  const randRestaurant = filteredResteraunts[idx];
  return (
    <div className="random-restaurant">
      <p>
        <a href={`https://wolt.com/en/isr/tel-aviv/restaurant/${randRestaurant.venue.slug}`} style={{ fontWeight: 'bold' }}>
          { randRestaurant.venue.name }
        </a>
      </p>
      <p>{ randRestaurant.venue.short_description }</p>
      <p>
        Rating:
        {' '}
        {
            randRestaurant.venue.rating !== undefined ? (
              randRestaurant.venue.rating.score
            ) : ('')
        }
        {' | '}
        Tag:
        {' '}
        { randRestaurant.venue.tags[0] }
        {' | '}
        Delivery:
        {' '}
        { randRestaurant.venue.estimate }
        {' '}
        min
      </p>
      <a href={`https://wolt.com/en/isr/tel-aviv/restaurant/${randRestaurant.venue.slug}`}>
        <img
          src={randRestaurant.image.url}
          alt={randRestaurant.venue.name}
          width="80%"
          style={{
            border: '1px solid black', display: 'block', marginLeft: 'auto', marginRight: 'auto',
          }}
        />
      </a>
    </div>
  );
}
export default RandomRestaurant;
