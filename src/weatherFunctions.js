// DayJS functionality
import {} from '../node_modules/dayjs/dayjs.min.js';
import {} from '../node_modules/dayjs/plugin/customParseFormat.js';
import {} from "../node_modules/dayjs/plugin/utc.js";
import {} from '../node_modules/dayjs/plugin/advancedFormat';
dayjs.extend(window.dayjs_plugin_customParseFormat);
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_advancedFormat);

// API keys
import { openWeather, visualCrossing } from './keys.json';

// Helpers
import { capitolizeFirst, dataRange } from './helpers';
  
  
// eBird / Weather Functions

export function parseWeather(times, weatherResults, parsedWeather) {
        // Clean up incidental if statements...maybe nix the object approach
  parsedWeather = {};
  // Icon
  let icon = weatherResults.start.data[0].weather[0].icon;
  parsedWeather.icon = `<img src="http://openweathermap.org/img/wn/${icon}.png">`;

  // CONDITION
  let startCondition = weatherResults.start.data[0].weather[0].description;
  let endCondition = null;
  if (weatherResults.end) {
    endCondition = weatherResults.end.data[0].weather[0].description;
  }
  parsedWeather.conditions = capitolizeFirst(dataRange(startCondition, endCondition));
  
  // TEMPERATURE
  let startTemp = weatherResults.start.data[0].temp;
  let endTemp;
  if (weatherResults.end) {
    endTemp = weatherResults.end.data[0].temp;
  }
  parsedWeather.temperature = 'Temperature: ' + dataRange(Math.round(startTemp), Math.round(endTemp)) + '°F';
  
  // WINDSPEED
  let windspeed = {
    start: {
      avg: weatherResults.start.data[0].wind_speed,
      gusts: weatherResults.start.data[0].wind_gust
    },
    end: {
      avg: null,
      gusts: null
    }
  }
  if (weatherResults.end) {
    windspeed.end.avg = weatherResults.end.data[0].wind_speed;
    windspeed.end.gusts = weatherResults.start.data[0].wind_gust;
  }
        // Figure out how to give gusts option
  parsedWeather.windspeed = `Wind: ${dataRange(Math.round(windspeed.start.avg), Math.round(windspeed.end.avg))}mph`;
  if (windspeed.start.gusts || windspeed.end.gusts) {
    parsedWeather.windspeed =  parsedWeather.windspeed + `(${dataRange(Math.round(windspeed.start.gusts), Math.round(windspeed.end.gusts))}mph gusts)`;
  }
  // CLOUD COVER
  let cloudCover = {
    start: weatherResults.start.data[0].clouds,
    end: null
  };
  if (weatherResults.end) {
    cloudCover.end = weatherResults.end.data[0].clouds;
  }
  parsedWeather.cloudCover = 'Cloud Cover: ' + dataRange(cloudCover.start, cloudCover.end) + '%';

  // HUMIDITY
  let humidity = {
    start: weatherResults.start.data[0].humidity,
    end: null
  }
  if (weatherResults.end) {
    humidity.end = weatherResults.end.data[0].humidity;
  }
  parsedWeather.humidity = 'Humidity: ' + dataRange(humidity.start, humidity.end) + '%';

  // SUNRISE
  let sunrise = dayjs.utc(weatherResults.start.data[0].sunrise, "X").add(times.offset, "seconds").format("h:mma"); //need to use utc and offset by correct timezone offset so avoid issues when local timezone is different than checklist timezone
  parsedWeather.sunrise = 'Sunrise: ' + sunrise;
 
  // SUNSET
  let sunset = dayjs.utc(weatherResults.start.data[0].sunset, "X").add(times.offset, "seconds").format("h:mma"); //need to use utc and offset by correct timezone offset so avoid issues when local timezone is different than checklist timezone
  parsedWeather.sunset = 'Sunset: ' + sunset;
  
  return parsedWeather;
}
export async function getWeather(times, checklistInfo, weatherResults) {
  console.log("Start time weather query for " + times.start.unix.local().format("YYYY-MM-DD h:mma Z"));
  weatherResults.start = await queryOpenWeather(times.start.unix.format("X"), checklistInfo.lat, checklistInfo.lon);
  if (checklistInfo.endTime) {
    console.log("End time weather query for " + times.end.unix.local().format("YYYY-MM-DD h:mma Z"));
    weatherResults.end = await queryOpenWeather(times.end.unix.format("X"), checklistInfo.lat, checklistInfo.lon);
  }
  return weatherResults;
}
export function getUnixTimes(times, checklistInfo) {
  times.start.unix = times.start.dayjs.utc(true).subtract(times.offset, 'seconds');
  if (checklistInfo.endTime) {
    times.end.unix = times.end.dayjs.utc(true).subtract(times.offset, 'seconds');
  }
  return times;
}
export function calculateEndTime(ebirdDateTime, durationHrs){
  const startTime = dayjs(ebirdDateTime, "YYYY-MM-DD HH:mm")
  const durationMinutes = durationHrs * 60;
  return startTime.add(durationMinutes, 'minute').format("YYYY-MM-DD HH:mm");
}
export async function getTimezoneOffset(times, checklistInfo) {
  const unixTime = times.start.dayjs.utc(true).format("X");
  const timezoneQuery =  await queryOpenWeather(unixTime, checklistInfo.lat, checklistInfo.lon);
  times.offset = timezoneQuery.timezone_offset;
  return times;
}
export async function getChecklistInfo(checklistId) {
  console.log('-------New Request-------')
  const myHeaders = new Headers();
  myHeaders.append("X-eBirdApiToken", "r0h8p3bh6k3v");
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  const checklistURL = 'https://api.ebird.org/v2/product/checklist/view/'+ checklistId;
  
  //reset for each call
  let checklistInfo = {};
  let times = {
    offset: 0,
    start: {
      dayjs: null,
      unix: ''
    },
    end: {
      dayjs: null,
      unix: ''
    }
  };

  try {
    const response = await fetch(checklistURL, requestOptions);
    if (!response.ok) {
      console.log(response);
      throw response;
    }
    if (response.ok) {
      const jsonResponse = await response.json();
      checklistInfo.checklistId = jsonResponse.subId;
      checklistInfo.locationId = jsonResponse.locId;
      checklistInfo.startTime = jsonResponse.obsDt;
      times.start.dayjs = dayjs(checklistInfo.startTime, "YYYY-MM-DD HH:mm");
      checklistInfo.obsTimeValid = jsonResponse.obsTimeValid;
      if (jsonResponse.durationHrs) {
        checklistInfo.durationHrs = jsonResponse.durationHrs;
        checklistInfo.endTime = calculateEndTime(checklistInfo.startTime, checklistInfo.durationHrs);
        times.end.dayjs = dayjs(checklistInfo.endTime, "YYYY-MM-DD HH:mm");
      }
        console.log('Checklist info from eBird')
        console.log(jsonResponse);

      //get location coordinates
      const coordUrl = 'https://api.ebird.org/v2/ref/region/info/'+checklistInfo.locationId;

      const response2 = await fetch(coordUrl, requestOptions);
      if (response2.ok) {
        const jsonResponse2 = await response2.json();
        checklistInfo.lon = jsonResponse2.bounds.maxX;
        checklistInfo.lat = jsonResponse2.bounds.maxY;
        checklistInfo.locationName  = jsonResponse2.result;

          console.log('LocationId info from eBird');
          console.log(jsonResponse2);
          console.log('checklistInfo: ');
          console.log(checklistInfo);
        return [checklistInfo, times];
      }
    }
  } catch(error) {
      console.log(error);
    return error;
  };
}
export async function queryOpenWeather(unixTime, lat, lon) {
  //submit OpenWeather query at time and checklist location
  const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall/timemachine';
  const queries = `?lat=${lat}&lon=${lon}&dt=${unixTime}&appid=${openWeather}&units=imperial`;
  try {
    const response = await fetch(baseUrl + queries)
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Weather Response for ' + unixTime)
      console.log(jsonResponse);
      return jsonResponse;
    }
  } catch(error) {
    console.log(error)
  };
}

//   { parseWeather, getWeather, getUnixTimes, getTimezoneOffset, getChecklistInfo, queryOpenWeather }
