import emoji from 'node-emoji';

export const apiUrl = 'https://ki9e8xgx8f.execute-api.us-east-1.amazonaws.com';

// Dizengoff Center
export const defaultLat = 32.075386;
export const defaultLon = 34.775170;

// Emoji list can be found here - https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
export const emojiCategories = {
  italian: 'spaghetti',
  'Central Asian': 'bento',
  asian: 'bento',
  american: 'flag-us',
  bakery: 'croissant',
  bbq: 'meat_on_bone',
  breakfast: 'fried_egg',
  burger: 'hamburger',
  café: 'coffee',
  chinese: 'takeout_box',
  dessert: 'cookie',
  fish: 'tropical_fish',
  french: 'flag-fr',
  bistro: 'flag-fr',
  'fried chicken': 'poultry_leg',
  greek: 'flag-gr',
  grill: 'meat_on_bone',
  healthy: 'green_salad',
  hungarian: 'flag-hu',
  'ice cream': 'ice_cream',
  indian: 'flag-in',
  japanese: 'flag-jp',
  mexican: 'flag-mx',
  noodles: 'spaghetti',
  pasta: 'spaghetti',
  pastry: 'croissant',
  salad: 'green_salad',
  thai: 'flag-th',
  vegan: 'seedling',
  vegetarian: 'seedling',
  sweets: 'lollipop',
  'bubble tea': 'tropical_drink',
  mediterranean: 'stuffed_flatbread',
  'middle eastern': 'stuffed_flatbread',
  pita: 'stuffed_flatbread',
  poke: 'bowl_with_spoon',
  bowl: 'bowl_with_spoon',
  soup: 'bowl_with_spoon',
  shawarma: 'tamale',
  crepes: 'pancakes',
  homemade: 'house_with_garden',
  local: 'house_with_garden',
  juice: 'orange',
  kebab: 'tamale',
  khachapuri: 'flatbread',
  kids: 'baby',
  kosher: 'star_of_david',
  smoothie: 'tropical_drink',
  'street food': 'stuffed_flatbread',
  beyondmeat: 'seedling',
  drinks: 'cocktail',
  georgian: 'flag-ge',
  fruit: 'apple',
};

export const categoryNameCorrection = {
  bbq: 'BBQ',
};

export const formatCategory = (category) => {
  try {
    return `${(emoji.search(emojiCategories[category] || category)[0] || { emoji: '' }).emoji} ${categoryNameCorrection[category] || category}`;
  } catch (err) {
    return category;
  }
};
