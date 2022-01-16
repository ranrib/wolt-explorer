import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Input, Button, Tooltip,
} from 'antd';
import axios from 'axios';
import { AimOutlined, GithubOutlined } from '@ant-design/icons';
import {
  apiUrl, defaultLat, defaultLon, colors,
} from './consts';
import columns from './columns';
import './App.css';

let fetched = false;

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState({ lat: defaultLat, lon: defaultLon });

  const fetchData = useCallback(async (locationData) => {
    if (fetched) return;
    fetched = true;
    const response = await axios.get(
      `${apiUrl}/?lat=${locationData.lat}&lon=${locationData.lon}`,
    );
    const categoriesSorted = Array.from(
      new Set(response.data.sections[0].items.map(({ venue }) => venue.tags[0])),
    );
    categoriesSorted.sort();
    setCategories(categoriesSorted.filter((name) => name).map((name) => ({
      text: name,
      value: name,
    })));
    setRestaurants(response.data.sections[0].items);
    setLoading(false);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      fetchData({ lat: position.coords.latitude, lon: position.coords.longitude });
      setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
      setLocationEnabled(true);
    }, async () => {
      fetchData(location);
    });
  }, [fetchData]);

  const filteredResteraunts = restaurants.filter((rest) => (
    rest.venue.name.toLowerCase().includes(search.toLowerCase())
        || (rest.venue.tags[0] && rest.venue.tags[0].toLowerCase().includes(search.toLowerCase()))
  ));

  const categoryColors = categories.reduce((obj, item, ind) => ({
    ...obj,
    [item.text.toLowerCase()]: colors[ind],
  }), {});

  return (
    <div className="App">
      <h1>Wolt Explorer</h1>
      <div className="navbar">
        <Input className="input-search" placeholder="Search for restaurants..." disabled={loading} value={search} onChange={(e) => setSearch(e.target.value)} allowClear />
        <Tooltip title={`Location is ${locationEnabled ? 'enabled' : 'disabled'}`} placement="left">
          <Button className="location-indication" type="dashed" icon={<AimOutlined style={{ color: locationEnabled ? '#23C552' : '#F84F31' }} />} />
        </Tooltip>
      </div>
      <Table
        size="small"
        rowKey={(row) => row.venue.id}
        dataSource={filteredResteraunts}
        columns={columns(location.lat, location.lon, categories, search, categoryColors)}
        loading={loading}
      />
      <br />
      This is an open source project hosted on
      {' '}
      <a target="_blank" rel="noreferrer" href="https://github.com/ranrib/wolt-explorer">
        <GithubOutlined />
        {' '}
        GitHub
      </a>
      .
      <br />
      We are not affiliated, associated, authorized, endorsed by, or in any way officially
      connected with
      {' '}
      <a target="_blank" rel="noreferrer" href="https://wolt.com/">Wolt</a>
      .
      <br />
      <br />
    </div>
  );
}

export default App;
