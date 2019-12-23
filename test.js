const aqicn = require('./index.js');

/**
 * TESTING INSTRUCTIONS
 *
 * Run `node test` or `npm run test` to test the output of this API via CLI
 */

// Test defaults (no data supplied)
// Should return results for Shanghai in English using demo token
aqicn(null, function (data) {
    console.log('\n\nShould return results for Shanghai in English:\n\n', data);
});

// Test defaults for Shanghai in Simplified Chinese using demo token
aqicn({ city: 'shanghai', lang: 'cn', token: 'demo' }, function (data) {
    console.log('\n\nShould return results for Shanghai in Simplified Chinese:\n\n', data);
});

// Test for "Unknown Station" error with an invalid city name
aqicn({ city: 'bnagkok', lang: 'en', token: 'demo' }, function (data) {
    console.log('\n\nShould return `Unknown station`:\n\n', data);
});
