// const aqicn = require('aqicn-api');
const aqicn = require('./index.js');

aqicn(null, function (data) {
    console.log(data);
});

aqicn({ city: 'shanghai', lang: 'cn', token: 'demo' }, function (data) {
    console.log(data);
});
