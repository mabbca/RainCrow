// DayJS functionality
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
dayjs.extend(advancedFormat);
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

// API keys
import { openWeather, visualCrossing } from './keys.json';

// Helpers
import { capitolizeFirst, dataRange } from './helpers';

import { appName } from './store'

  
// eBird / Weather Functions

export function parseWeather(times, weatherResults, parsedWeather) {
  parsedWeather = { 
    icon: '',
    conditions: null,
    temperature: null,
    windspeed: null,
    cloudCover: null,
    humidity: null,
    sunrise: null,
    sunset: null,
    attr: `Weather generated by <a href="https://raincrow.netlify.app/" target="_blank">${appName}</a>` };

  // Icon
  let icons = [];
    //  check for multiple icons, if they are unique, add them
  for (let obj of weatherResults.start.data[0].weather) {
    if (!icons.includes(obj.icon)){
      icons.push(obj.icon);
    }
  }
    // if end weather, check for multiple icons; if they are unique, add them
  if (weatherResults.end) {
    for (let obj of weatherResults.end.data[0].weather) {
      if (!icons.includes(obj.icon)){
      icons.push(obj.icon);
      }
    }
  }
    // display all icons
  for (let icon of icons) {
    parsedWeather.icon += `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="Open Weather Icon" loading="lazy">`; 
  }

  // CONDITION
  let conditions = [];
    // check for multiple conditions, if they are unique add them
  for (let obj of weatherResults.start.data[0].weather) {
    conditions.push(obj.description);
  }
  let endCondition = null;
  if (weatherResults.end) {
    for (let obj of weatherResults.end.data[0].weather) {
      if (!conditions.includes(obj.description)) {
        conditions.push(obj.description)
      }
    }
  }
    // format conditions based on number of different conditions
  if (conditions.length > 2) {
    parsedWeather.conditions = capitolizeFirst(conditions.join(', '));
  } else if (conditions.length === 2) {
    parsedWeather.conditions = capitolizeFirst(conditions.join(' - '));
  } else {
    parsedWeather.conditions = capitolizeFirst(conditions.join())
  }
  
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
    parsedWeather.windspeed =  parsedWeather.windspeed + ` (${dataRange(Math.round(windspeed.start.gusts), Math.round(windspeed.end.gusts))}mph gusts)`;
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
export async function getWeather(times, locationObj, weatherResults) {
  console.log("Start time weather query for " + times.start.utcTime.local().format("YYYY-MM-DD h:mma Z"));
  weatherResults.start = await queryOpenWeather(times.start.utcTime.format("X"), locationObj.lat, locationObj.lon);
  if (times.end.utcTime && times.end.utcTime.format("X") != times.start.utcTime.format("X")) {
    console.log("End time weather query for " + times.end.utcTime.local().format("YYYY-MM-DD h:mma Z"));
    weatherResults.end = await queryOpenWeather(times.end.utcTime.format("X"), locationObj.lat, locationObj.lon);
  }
  return weatherResults;
}
export function getUnixTimes(times) {
  times.start.utcTime = dayjs(times.start.localTime).utc(true).subtract(times.offset, 'seconds');
  if (times.end.localTime) {
    times.end.utcTime = dayjs(times.end.localTime).utc(true).subtract(times.offset, 'seconds');
  }
  return times;
}
export function calculateEndTimePost(ebirdDateTime, durationHrs){
  const startTime = dayjs(ebirdDateTime, "YYYY-MM-DD HH:mm")
  const durationMinutes = durationHrs * 60;
  return startTime.add(durationMinutes, 'minute').format("YYYY-MM-DD HH:mm");
}
export async function getTimezoneOffset(times, locationObj) {
  const unixTime = dayjs(times.start.localTime).format("X");
  try {
    console.log("Timezone Query:")
    const timezoneQuery =  await queryOpenWeather(unixTime, locationObj.lat, locationObj.lon);
    if (timezoneQuery) {
      times.offset = timezoneQuery.timezone_offset;
      return times;
    } 
    // else throw new Error("Error! Check that valid coordinates and time are entered.")
  } catch(error) {
    throw error;
  }

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

  let realChecklistId = extractChecklistId(checklistId);

  const checklistURL = 'https://api.ebird.org/v2/product/checklist/view/'+ realChecklistId;
  
  //reset for each call
  let checklistInfo = {};
  let times = {
    offset: 0,
    start: {
      localTime: null,
      utcTime: null
    },
    end: {
      localTime: null,
      utcTime: null
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
      times.start.localTime = dayjs(checklistInfo.startTime, "YYYY-MM-DD HH:mm");
      // console.log('times.start.localTime');
      // console.log(times.start.localTime);
      checklistInfo.obsTimeValid = jsonResponse.obsTimeValid;
      if (jsonResponse.durationHrs) {
        checklistInfo.durationHrs = jsonResponse.durationHrs;
        checklistInfo.endTime = calculateEndTimePost(checklistInfo.startTime, checklistInfo.durationHrs);
        times.end.localTime = dayjs(checklistInfo.endTime, "YYYY-MM-DD HH:mm");
        // console.log('times.end.localTime');
        // console.log(times.end.localTime);
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
          console.log('checklistInfo object: ');
          console.log(checklistInfo);
        return [checklistInfo, times];
      }
    }
  } catch(error) {
      console.log(error);
      return [error, error];
  };
}
function extractChecklistId(checklistId) {
  let checklistRegex = /S\d{7}\d*$/;
  let extractedId = checklistId.trim().match(checklistRegex);
  return extractedId[0];
}
export async function queryOpenWeather(unixTime, lat, lon) {
  //submit OpenWeather query at time and location
  const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall/timemachine';
  const queries = `?lat=${lat}&lon=${lon}&dt=${unixTime}&appid=${openWeather}&units=imperial`;
  // const queries = `?lat=${lat}&lon=${lon}&dt=error&appid=${openWeather}&units=imperial`; // trigger errors for debug
  try {
    const response = await fetch(baseUrl + queries)
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Weather Response for ' + unixTime)
      console.log(jsonResponse);
      return jsonResponse;
    } else throw new Error(`${response.statusText} (code: ${response.status})`);
  } catch(error) {
    throw error;
  };
}

//   { parseWeather, getWeather, getUnixTimes, getTimezoneOffset, getChecklistInfo, queryOpenWeather }
