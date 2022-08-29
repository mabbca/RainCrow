<script>
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

  // Components
  import PostView from './lib/PostView.svelte'
  import PreView from './lib/PreView.svelte'

  // Stores
  import { checklistId, resultsShow, parsedWeather, parsedWeatherArr } from './store';

  // Helpers
  import { capitolizeFirst, dataRange } from './helpers';

  // State
  let postView = true;
  let checklistInfo = {};
  let optionsView = false;
  let isLoading = false;

  $: $parsedWeatherArr = Object.entries($parsedWeather);

  // Weather Variables
  let timezoneOffset;
  let unixStartTime; // calculated after getting timezone offset
  let unixEndTime; // calculated after getting timezone offset
  let startTimeDayjs // Day.js start time object
  let endTimeDayjs // Day.js end time object
  let startTimeWeather;
  let endTimeWeather;

  // eBird / Weather Functions
  async function getWeatherHandler() {
      isLoading = true;
      await getChecklistInfo($checklistId);
      timezoneOffset = await getTimezoneOffset();
      getUnixTimes();
      await getWeather();
      $resultsShow = true;
      isLoading = false;
      parseWeather();
  }
  function parseWeather() {
    let startCondition = startTimeWeather.data[0].weather[0].description;
    let endCondition = endTimeWeather.data[0].weather[0].description;
    $parsedWeather.conditions.display = capitolizeFirst(dataRange(startCondition, endCondition));

    let startTemp = startTimeWeather.data[0].temp;
    let endTemp = endTimeWeather.data[0].temp;
    $parsedWeather.temperature.display = 'Temperature: ' + dataRange(Math.round(startTemp), Math.round(endTemp)) + '°F';

    let windspeed = {
      start: {
        avg: startTimeWeather.data[0].wind_speed,
        gusts: startTimeWeather.data[0].wind_gust
      },
      end: {
        avg: endTimeWeather.data[0].wind_speed,
        gusts: startTimeWeather.data[0].wind_gust
      }
    }
    $parsedWeather.windspeed.display = `Wind: ${dataRange(Math.round(windspeed.start.avg), Math.round(windspeed.end.avg))}mph`;
    if (windspeed.start.gusts || windspeed.end.gusts) {
      $parsedWeather.windspeed.display =  $parsedWeather.windspeed.display + `(${dataRange(Math.round(windspeed.start.gusts), Math.round(windspeed.end.gusts))}mph gusts)`;
    }
    
    let sunrise = dayjs.utc(startTimeWeather.data[0].sunrise, "X").add(timezoneOffset, "seconds").format("h:mma"); //need to use utc and offset by correct timezone offset so avoid issues when local timezone is different than checklist timezone
    $parsedWeather.sunrise.display = 'Sunrise: ' + sunrise;

    let sunset = dayjs.utc(startTimeWeather.data[0].sunset, "X").add(timezoneOffset, "seconds").format("h:mma"); //need to use utc and offset by correct timezone offset so avoid issues when local timezone is different than checklist timezone
    $parsedWeather.sunset.display = 'Sunset: ' + sunset;

    let cloudCover = {
      start: startTimeWeather.data[0].clouds,
      end: endTimeWeather.data[0].clouds
    };
    $parsedWeather.cloudCover.display = 'Cloud Cover: ' + dataRange(cloudCover.start, cloudCover.end) + '%';

    let humidity = {
      start: startTimeWeather.data[0].humidity,
      end: endTimeWeather.data[0].humidity
    }
    $parsedWeather.humidity.display = 'Humidity: ' + dataRange(humidity.start, humidity.end) + '%';
  }
  async function getWeather() {
    console.log("Start time weather query for " + unixStartTime.local().format("YYYY-MM-DD h:mma Z"));
    startTimeWeather = await queryOpenWeather(unixStartTime.format("X"), checklistInfo.lat, checklistInfo.lon);
    if (checklistInfo.endTime) {
      console.log("End time weather query for " + unixEndTime.local().format("YYYY-MM-DD h:mma Z"));
      endTimeWeather = await queryOpenWeather(unixEndTime.format("X"), checklistInfo.lat, checklistInfo.lon);
    }
  }
  function getUnixTimes() {
    unixStartTime = startTimeDayjs.utc(true).subtract(timezoneOffset, 'seconds');
    if (checklistInfo.endTime) {
      unixEndTime = endTimeDayjs.utc(true).subtract(timezoneOffset, 'seconds');
    }
  }
  function calculateEndTime(ebirdDateTime, durationHrs){
    const startTime = dayjs(ebirdDateTime, "YYYY-MM-DD HH:mm")
    const durationMinutes = durationHrs * 60;
    return startTime.add(durationMinutes, 'minute').format("YYYY-MM-DD HH:mm");
  }
  async function getTimezoneOffset() {
    const unixTime = startTimeDayjs.utc(true).format("X");
    const timezoneQuery =  await queryOpenWeather(unixTime, checklistInfo.lat, checklistInfo.lon);
    return timezoneQuery.timezone_offset;
  }
  async function getChecklistInfo(checklistId) {
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

    checklistInfo = {};

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
        startTimeDayjs = dayjs(checklistInfo.startTime, "YYYY-MM-DD HH:mm");
        checklistInfo.obsTimeValid = jsonResponse.obsTimeValid;
        if (jsonResponse.durationHrs) {
          checklistInfo.durationHrs = jsonResponse.durationHrs;
          checklistInfo.endTime = calculateEndTime(checklistInfo.startTime, checklistInfo.durationHrs);
          endTimeDayjs = dayjs(checklistInfo.endTime, "YYYY-MM-DD HH:mm");
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
          // return checklistInfo;
        }
      }
    } catch(error) {
      console.log(error);
      return error;
    };
  }
  async function queryOpenWeather(unixTime, lat, lon) {
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

  // Other Functions
    const toggleOptions = () => {
    optionsView = !optionsView;
  }


</script>

<div class="vertical-grid-container" class:blur={optionsView}>
  <div class="title">
    <h1>eBird Weather</h1>
  </div>
  <nav>
    <div class="nav-item post-submit" on:click={()=> postView = true} class:active="{postView}">
      <p>Submitted</p>
    </div>
    <div class="nav-item pre-submit" on:click={()=> postView = false} class:active="{!postView}">
      <p>Pre-Submit</p>
    </div>
  </nav>

  {#if postView}
  <PostView 
    getWeatherHandler={getWeatherHandler}
    isLoading={isLoading}
    checklistInfo={checklistInfo}
   />
  {:else}
  <PreView  />
  {/if}

<!-- need to move weather states and some logic into the components so that PRE and POST don't effect each other  -->


<!-- --------FOOTER-------- -->
  <footer>
    <div>
      <!-- <p>Weather Data provided by <a href="#">OpenWeather</a></p>
      <p>Created by <a href="#">Parker Davis</a></p> -->
      <a href="#"><p>About</p></a>
    </div>
    <div>
      <button on:click={toggleOptions}>Options</button>
    </div>
  </footer>
</div>

<!-- --------OPTIONS MENU-------- -->

{#if optionsView}
<div class="options-container">
  {#if $resultsShow}
    <div class="results-preview">
      <h3>Preview:</h3>
      {#each $parsedWeatherArr as data}
        {#if data[1].show}<p>{#if data[1].display}{data[1].display}{:else}No {data[0]}{/if}</p>{/if}
      {/each}
    </div>
  {/if}
  <div class="options-list">
    <div class="option-item">
      <input type="checkbox" name="conditions" id="conditions" bind:checked={$parsedWeather.conditions.show}>
      <label for="conditions">Conditions</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="temperature" id="temperature" bind:checked={$parsedWeather.temperature.show}>
      <label for="temperature">Temperature</label>
      <!-- <select name="temp-unit" id="temp-unit">
        <option value="f">F°</option>
        <option value="c">C°</option>
      </select> -->
    </div>
    <div class="option-item">
      <input type="checkbox" name="windspeed" id="windspeed" bind:checked={$parsedWeather.windspeed.show}>
      <label for="windspeed">Windspeed</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="sunrise" id="sunrise" bind:checked={$parsedWeather.sunrise.show}>
      <label for="sunrise">Sunrise</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="sunset" id="sunset" bind:checked={$parsedWeather.sunset.show}>
      <label for="sunset">Sunset</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="cloudCover" id="cloudCover" bind:checked={$parsedWeather.cloudCover.show}>
      <label for="cloudCover">Cloud Cover (%)</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="humidity" id="humidity" bind:checked={$parsedWeather.humidity.show}>
      <label for="humidity">Humidity (%)</label>
    </div>
    <!-- <ul style="color: gray; font-size: small">
      <li>Condition description - show icon</li>
      <li>Temperature</li>
      <li>Wind Speed</li>
      <li>Wind Direction</li>
      <li>Gusts</li>
      <li>Sunrise</li>
      <li>Sunset</li>
      <li>Cloud Cover (%)</li>
      <li>dew point</li>
      <li>humidity</li>
      <li>visibility</li>
    </ul> -->
  </div>

  <div class="options-bottom">
    <button on:click={toggleOptions} class="done-button">DONE</button>
  </div>
</div>
{/if}


<style>
  .vertical-grid-container {
    height: 90vh;
    width: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
  }
  .blur {
    filter: blur(10px);
    transition: filter 500ms;
  }
  .title {
    text-align: center;
  }
  nav {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 10px;
    height: 3rem;
    background-color: #EEEEEE;
  }
  .nav-item {
    width: 100%;
    height: 80%;
    border-radius: 10px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .active {
    background-color: #FFFFFF;
  }
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer button {
    background-color: whitesmoke;
    color: black;
    border: 1px black solid;
    cursor: pointer;
  }
  footer button:hover {
    background-color: lightgray;
  }
  .options-container {
    background-color: white;
    position: absolute;
    width: 500px;
    max-width: 95%;
    max-height: 87vh;
    top: 50%;
    left: 50%;
    transform:translate(-50%, -51%);
    border: 1px black solid;
    padding: 1rem;

    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .options-list {
    overflow: scroll;
  }
  .done-button {
    width: 200px;
  }
  .results-preview {
    margin: auto;
    min-height: 75px;
    min-width: 200px;
    text-align: center;
    background-color: #F3F8FB;
    padding: 10px;
  }
  .option-item {
    padding: 5px 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .option-item input {
    flex-grow: 0;
  }
  .option-item label {
    flex-grow: 1;
  }

</style>
