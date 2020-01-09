# Aqicn API

Node wrapper for the AQICN Air Quality Index API (https://aqicn.org/). New module for accessing AQICN global air quality data, now that Aqicn.org provides a REST API. No web scraping, etc.


## Installation

```
npm i -s aqicn-api
```


## Getting an API Token

You should be able to get an API token for 1000 requests per minute, in just a few minutes, using the online form, at: https://aqicn.org/api/ 

The API token `demo` can be used for testing, but will only return results for **Shanghai (上海)**.


## Usage

Make a request to the Aqicn.org REST API to gather Air Quality data for a given city (One method exposes the current Aqicn API):


#### Configuration Object Inputs:

* `city` **(required)**: The city name for the lookup
* `token` **(required)**: Your API token (See above)
* `lang` (optional): Response Explanation Language - currently `en` (English) & `cn` (Simplified Chinese) are supported
* `lat` (optional): Can be used instead of city for lat/long based location lookup
* `long` (optional): Can be used instead of city for lat/long based location lookup


```
const aqicn = require('aqicn-api');

aqicn({ city: 'shanghai', lang: 'en', token: 'demo' }, function (data) {
    console.log(data);
});
```

#### Example with Lat / long instead of city name

```
const aqicn = require('aqicn-api');

aqicn({ lat: 31.2047372, long: 121.4489017, lang: 'en', token: 'demo' }, function (data) {
    console.log(data);
});
```

## API Response

```
{ 
  aqi: 82,
  idx: 1437,
  city: 'Shanghai (上海)',
  dominentpol: 'pm25',
  time: 1577120400000,
  level: 5,
  co: 9.1,
  no2: 20.6,
  o3: 29.3,
  p: 1018.4,
  pm10: 33,
  pm25: 82,
  so2: 3.6,
  t: 11.6,
  w: 0.1,
  url: 'https://aqicn.org/city/shanghai',
  geo: [ 31.2047372, 121.4489017 ],
  label: 'Moderate',
  implications:
   'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
  precautions:
   'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
  attributions:
   [ { url: 'http://www.semc.gov.cn/',
       name: 'Shanghai Environment Monitoring Center(上海市环境监测中心)' },
     { url: 'http://106.37.208.233:20035/emcpublish/',
       name:
        'China National Urban air quality real-time publishing platform (全国城市空气质量实时发布平台)' },
     { url:
        'https://china.usembassy-china.org.cn/embassy-consulates/shanghai/air-quality-monitor-stateair/',
       name: 'U.S. Consulate Shanghai Air Quality Monitor' },
     { url: 'https://waqi.info/',
       name: 'World Air Quality Index Project' } ]
}
```

## Todos

Pull requests welcome!

* [x] Add additional languages
* [x] Lat/long based lookups


