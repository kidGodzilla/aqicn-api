/**
 * @fileOverview
 * @name aqicn-api.js
 * @author James Futhey <@kidGodzilla>
 * @license MIT
 */
const request = require('superagent');

/**
 * Make a request to the Aqicn.org REST API to gather Air Quality data for a given city.
 *
 * @param {Object} configuration
 * @param {Function} callback
 * @api public
 */
module.exports = function (conf, cb) {

    const strings = {
        en: {
            0: {
                min: 0,
                max: 50,
                label: 'Good',
                implications: 'Air quality is considered satisfactory, and air pollution poses little or no risk',
                precautions: 'None'
            },
            1: {
                min: 51,
                max: 100,
                label: 'Moderate',
                implications: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
                precautions: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.'
            },
            2: {
                min: 101,
                max: 150,
                label: 'Unhealthy for Sensitive Groups',
                implications: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
                precautions: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.'
            },
            3: {
                min: 151,
                max: 200,
                label: 'Unhealthy',
                implications: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
                precautions: 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.'
            },
            4: {
                min: 201,
                max: 300,
                label: 'Very Unhealthy',
                implications: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
                precautions: 'Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.'
            },
            5: {
                min: 300,
                max: 500,
                label: 'Hazardous',
                implications: 'Health alert: everyone may experience more serious health effects.',
                precautions: 'Everyone should avoid all outdoor exertion.'
            }
        },
        cn: {
            0: {
                min: 0,
                max: 50,
                label: '优',
                implications: '空气质量令人满意，基本无空气污染',
                precautions: '各类人群可正常活动'
            },
            1: {
                min: 51,
                max: 100,
                label: '良',
                implications: '空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响',
                precautions: '极少数异常敏感人群应减少户外活动'
            },
            2: {
                min: 101,
                max: 150,
                label: '轻度污染',
                implications: '易感人群症状有轻度加剧，健康人群出现刺激症状',
                precautions: '儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼'
            },
            3: {
                min: 151,
                max: 200,
                label: '中度污染',
                implications: '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响',
                precautions: '儿童、老年人及心脏病、呼吸系统疾病患者避免长时间、高强度的户外锻炼，一般人群适量减少户外运动'
            },
            4: {
                min: 201,
                max: 300,
                label: '重度污染',
                implications: '心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状',
                precautions: '儿童、老年人及心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动'
            },
            5: {
                min: 300,
                max: 500,
                label: '严重污染',
                implications: '健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病',
                precautions: '儿童、老年人和病人应停留在室内，避免体力消耗，一般人群避免户外活动'
            }
        }
    };

    let { lang = 'en', city = 'beijing', token = 'demo', lat, long } = conf || {};
    if (lat && long) city = `geo:${ lat };${ long }`;

    let url = `https://api.waqi.info/feed/${ city }/?token=`;

    request.get(url + token).set('Content-Type', 'application/json').end((err, response) => {

        if (!cb || typeof cb !== 'function') return console.error('Error: Callback is not a function.');

        if (!response || !response.body) return cb('Error making API request');
        else if (!response.body.data) return cb(response.body);

        let data = response.body.data;

        // Create a "level" from 0-5 representing the AQI
        let level = Math.floor(data.aqi / 50);
        if (level >= 5) level--;
        data.level = Math.max(level, 5);

        // Normalize API response values
        if (data.iaqi) for (var k in data.iaqi) {
            try {
                data[k] = data.iaqi[k].v;
            } catch(e){}
        }

        try { if (data.time) data.time = data.time.v * 1000 } catch(e){}

        if (data.city) {
            try {
                data.url = data.city.url;
                data.geo = data.city.geo;
                if (data.city.name) data.city = data.city.name;
            } catch(e){}
        }

        let attributions = data.attributions;
        delete data.attributions;
        delete data.debug;
        delete data.iaqi;

        // Add strings
        if (strings[lang][level]) data = Object.assign(data, strings[lang][level]);

        data.attributions = attributions;
        delete data.max;
        delete data.min;

        cb(data);
    });

};
