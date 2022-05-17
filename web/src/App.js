import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, Input, Button, Tooltip, Modal,
} from 'antd';
import axios from 'axios';
import {
  AimOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  apiUrl, defaultLat, defaultLon, formatCategory,
} from './consts';
import columns from './columns';
import './App.css';

let fetched = false;

function App() {
  const [error, setError] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState({
    lat: defaultLat,
    lon: defaultLon,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = useCallback(async (locationData) => {
    if (fetched) return;
    fetched = true;
    const response = await axios.get(
      `${apiUrl}/?lat=${locationData.lat}&lon=${locationData.lon}`,
    );
    if (!response.data.sections[0].items) {
      setError(response.data.sections[0].title);
      setLoading(false);
      return;
    }
    const categoriesSorted = Array.from(
      new Set(response.data.sections[0].items.map(({ venue }) => venue.tags[0])),
    );
    categoriesSorted.sort();
    setCategories(
      categoriesSorted
        .filter((name) => name)
        .map((name) => ({
          text: formatCategory(name),
          value: name,
        })),
    );
    setRestaurants(response.data.sections[0].items);
    setLoading(false);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        fetchData({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationEnabled(true);
      },
      async () => {
        fetchData(location);
      },
    );
  }, [fetchData]);

  const filteredResteraunts = restaurants.filter(
    (rest) => rest.venue.name.toLowerCase().includes(search.toLowerCase())
      || (rest.venue.tags[0]
    && rest.venue.tags[0].toLowerCase().includes(search.toLowerCase())),
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="App">
      <h1>Wolt Explorer</h1>
      <div className="navbar">
        <Input
          className="input-search"
          placeholder="Search for restaurants..."
          disabled={loading}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Tooltip
          title={`Location is ${locationEnabled ? 'enabled' : 'disabled'}`}
          placement="left"
        >
          <div style={{ display: 'contents' }}>
            <Button
              className="location-indication"
              type="dashed"
              icon={
                (
                  <AimOutlined
                    style={{ color: locationEnabled ? '#23C552' : '#F84F31' }}
                  />
                )
              }
            />
            <Button
              onClick={showModal}
              className="information"
              type="dashed"
              icon={<InfoCircleOutlined />}
            />
          </div>
        </Tooltip>
      </div>
      {!error
        ? (
          <Table
            size="small"
            rowKey={(row) => row.venue.id}
            dataSource={filteredResteraunts}
            columns={columns(location.lat, location.lon, categories, search)}
            loading={loading}
          />
        )
        : (<p>{error}</p>)}
      <br />
      This is an open source project hosted on
      {' '}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/ranrib/wolt-explorer"
      >
        <GithubOutlined />
        {' '}
        GitHub
      </a>
      .
      <br />
      We are not affiliated, associated, authorized, endorsed by, or in any way
      officially connected with
      {' '}
      <a target="_blank" rel="noreferrer" href="https://wolt.com/">
        Wolt
      </a>
      .
      <br />
      <br />
      <Modal
        title="How to use Wolt Explorer"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Wolt Explorer allows advanced filtering and sorting on Wolt
          restaurants.
        </p>
        <p>
          Searching can be done by typing into the text search, or by filtering
          data in the table columns.
          <FilterOutlined />
        </p>
        <p>
          Sorting can be done by clicking on the column header.
          <SortAscendingOutlined />
        </p>
        <p>
          Distance and delivery time is based on your location. Make sure your
          location is enabled (Green) or disabled (Red).
          <AimOutlined />
        </p>
      </Modal>
    </div>
  );
}

export default App;
