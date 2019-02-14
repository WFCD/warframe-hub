const fetch = require('node-fetch');
const fs = require('fs');

const jsonFileName = "initialWorldstate.json";
const jsonFolder = "./src/assets/json";
const apiBaseUrl = "api.warframestat.us";
const apiPlatforms = [
  "pc",
  "ps4",
  "xb1",
  "swi"
];


function main() {
  Promise.all(apiPlatforms.map((platform) => {
    return fetch(`https://${apiBaseUrl}/${platform}`)
      .then(t => t.text())
      .then(JSON.parse)
      .then(parseBase.bind(null, platform))
      .catch(onError);
  })).then((platformsData) => {
    const output = platformsData.reduce((acc, data) => {
      acc[data[0]] = data[1];
      return acc;
    }, {});
    fs.writeFile(
      `${jsonFolder}/${jsonFileName}`,
      JSON.stringify(output, null, 2),
      function(err) {
        if(err) {
          return console.log(err);
        }
        console.info();
        console.info(`${jsonFileName} updated at ${jsonFolder}/${jsonFileName}`);
      }
    );
  });
}

function onError(error) {
  console.error(error);
}

function parseBase(platform, data) {
  const platformOutput = parseObject(data, platform, platform);
  return [platform, platformOutput];
}

function parseObject(data, key, objectPath = "") {
  if (typeof(data) !== 'object') {
    return null;
  }

  const orderedParseFunctions = [
    parseArray,
    parseObject,
    parseBoolean,
    parseDate,
    parseId,
    parseNumber,
    parseETA,
    parseDefault
  ];
  const cleanedData = {};

  Object.entries(data).forEach(([key, prop]) => {
    let temp;
    for (let fun of orderedParseFunctions) {
      temp = fun(prop, key, `${objectPath}.${key}`);
      if (temp !== null) {
        break;
      }
    }
    cleanedData[key] = temp;
  });

  return cleanedData;
}

function parseArray(data) {
  return Array.isArray(data) ? [] : null;
}

function parseBoolean(data, key) {
  if (typeof(data) !== 'boolean') return null;

  return key.toLowerCase().includes('expired');
}

function parseDate(data) {
  return !isNaN(new Date(data)) ? "2000-01-01T01:00:00.000Z" : null;
}

function parseId(data, key) {
  return key.toLowerCase().includes('id') ? "12345" : null;
}

function parseNumber(data) {
  return !isNaN(data) ? "0.00" : null;
}

function parseETA(data) {
  return /([-\d]+y |)([-\d]+d |)([-\d]+h |)([-\d]+m |)[-\d]+s/.test(data) ? "1h 1m 1s" : null;
}

function parseDefault(data, key, objectPath) {
  const defaultOutput = "Loading...";
  console.info(`Defaulting ${objectPath} - ${data} to ${defaultOutput}`);
  return defaultOutput;
}

main();