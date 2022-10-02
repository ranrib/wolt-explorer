import React from 'react';
import { getDistance } from 'geolib';
import Highlighter from 'react-highlight-words';
import {
  Badge, Tag, Tooltip, Rate,
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, DollarTwoTone, DollarOutlined, StarFilled,
} from '@ant-design/icons';
import { formatCategory } from './consts';

const columns = (latitude, longitude, categories, search) => [
  {
    title: 'Restaurant',
    dataIndex: ['venue', 'name'],
    render: (name, row) => (
      <div>
        <Tooltip overlayInnerStyle={{ width: '515px' }} title={<img src={row.image.url} width={500} alt={name} />} placement="right">
          <a target="_blank" rel="noreferrer" href={`https://wolt.com/en/isr/tel-aviv/restaurant/${row.venue.slug}`}>
            <Highlighter
              searchWords={search.split(' ')}
              autoEscape
              textToHighlight={name}
            />
          </a>
        </Tooltip>
        {' '}
        {
          row.venue.badges && row.venue.badges[0] && row.venue.badges[0].text === 'New'
          && <Tooltip title="New on Wolt"><StarFilled style={{ color: '#ffcd3c' }} /></Tooltip>
        }
        <br />
        <Highlighter
          searchWords={search.split(' ')}
          autoEscape
          textToHighlight={row.venue.short_description}
        />
      </div>
    ),
    filters: [
      {
        text: (
          <>
            <StarFilled style={{ color: '#ffcd3c' }} />
            {' '}
            New on Wolt
          </>
        ),
        value: 'New',
      },
    ],
    onFilter: (value, row) => (
      row.venue.badges && row.venue.badges[0] && row.venue.badges[0].text === value
    ),
  },
  {
    title: 'Delivery',
    dataIndex: ['venue', 'estimate'],
    sorter: (a, b) => a.venue.estimate - b.venue.estimate,
    render: (estimate) => `${estimate} min`,
    sortDirections: ['ascend', 'descend'],
    defaultSortOrder: 'ascend',
  },
  {
    title: 'Distance',
    dataIndex: ['venue', 'location'],
    render: (location, row) => `${(getDistance({ latitude, longitude }, { latitude: location[1], longitude: location[0] }) / 1000).toFixed(1)} km (${row.venue.delivery_price})`,
    sorter: (a, b) => getDistance(
      { latitude, longitude }, { latitude: a.venue.location[1], longitude: a.venue.location[0] },
    ) - getDistance(
      { latitude, longitude }, { latitude: b.venue.location[1], longitude: b.venue.location[0] },
    ),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Wolt Price',
    dataIndex: ['venue', 'price_range'],
    sorter: (a, b) => a.venue.price_range - b.venue.price_range,
    sortDirections: ['descend', 'ascend'],
    render: (range) => <Rate disabled count={4} defaultValue={range} character={({ index }) => (index < range ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
    filters: [
      {
        text: <Rate disabled count={4} defaultValue={1} character={({ index }) => (index < 1 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 1,
      },
      {
        text: <Rate disabled count={4} defaultValue={2} character={({ index }) => (index < 2 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 2,
      },
      {
        text: <Rate disabled count={4} defaultValue={3} character={({ index }) => (index < 3 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 3,
      },
      {
        text: <Rate disabled count={4} defaultValue={4} character={({ index }) => (index < 4 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 4,
      },
    ],
    onFilter: (value, row) => row.venue.price_range === value,
  },
  {
    title: 'Google Price',
    dataIndex: ['google', 'p'],
    sorter: (a, b) => a.google.p - b.google.p,
    sortDirections: ['descend', 'ascend'],
    render: (range) => <Rate disabled count={4} defaultValue={range} character={({ index }) => (index < range ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
    filters: [
      {
        text: <Rate disabled count={4} defaultValue={1} character={({ index }) => (index < 1 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 1,
      },
      {
        text: <Rate disabled count={4} defaultValue={2} character={({ index }) => (index < 2 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 2,
      },
      {
        text: <Rate disabled count={4} defaultValue={3} character={({ index }) => (index < 3 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 3,
      },
      {
        text: <Rate disabled count={4} defaultValue={4} character={({ index }) => (index < 4 ? <DollarTwoTone twoToneColor="#52c41a" /> : <DollarOutlined />)} />,
        value: 4,
      },
    ],
    onFilter: (value, row) => row.google.p === value,
  },
  {
    title: 'Wolt Rating',
    dataIndex: ['venue', 'rating', 'score'],
    render: (score) => score || '-',
    sorter: (a, b) => {
      const venueA = (a.venue.rating && parseFloat(a.venue.rating.score, 10)) || 0;
      const venueB = (b.venue.rating && parseFloat(b.venue.rating.score, 10)) || 0;
      return venueA - venueB;
    },
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Google Rating',
    dataIndex: ['google', 'r'],
    render: (score) => (score ? score * 2 : '-'),
    sorter: (a, b) => {
      const venueA = (a.google.r && parseFloat(a.google.r, 10)) || 0;
      const venueB = (b.google.r && parseFloat(b.google.r, 10)) || 0;
      return venueA - venueB;
    },
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Tag',
    dataIndex: ['venue', 'tags'],
    render: (tags) => (tags
      ? (
        <Tag className="category-tag">
          <Highlighter searchWords={search.split(' ')} autoEscape textToHighlight={formatCategory(tags[0])} />
        </Tag>
      ) : ''
    ),
    filters: categories,
    filterMode: 'tree',
    filterSearch: (input, row) => (
      row.venue.tags[0].toString().toLowerCase() === input.toLowerCase()
    ),
    onFilter: (value, row) => (
      row.venue.tags[0] && row.venue.tags[0].toString().toLowerCase() === value.toLowerCase()
    ),
    className: 'tag-column',
  },
  {
    title: 'Online',
    dataIndex: ['venue', 'online'],
    render: (isOnline) => <Badge count={isOnline ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CloseCircleOutlined style={{ color: '#f5222d' }} />} />,
    filters: [
      {
        text: 'Online',
        value: 'true',
      },
      {
        text: 'Offline',
        value: 'false',
      },
    ],
    onFilter: (value, row) => row.venue.online.toString() === value,
    defaultFilteredValue: ['true'],
  },
];

export default columns;
