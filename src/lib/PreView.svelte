<script>
  //DayJS
  import dayjs from 'dayjs'

  // Props
  export let activeOptionsArr;

  // Weather Functions
  import { getTimezoneOffset, getUnixTimes, getWeather, parseWeather } from '../weatherFunctions';
 
  // Stores
  import { preParsedWeather, preParsedWeatherArr, preStatus, appName } from '../store';

  //Clipboard stuff, move elsewhere
  let weatherCopy = '';
  let copyButtonText = 'Copy to clipboard'
  let copyButtonDisabled = false;
  $: if($preStatus === 'loading') {
    copyButtonDisabled = false;
    copyButtonText = 'Copy to clipboard'
  }
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(weatherCopy).then(
        function () {
          copyButtonText = "Copied!";
          copyButtonDisabled = true;
          setTimeout(()=> {
            copyButtonText="Copy to clipboard"
            copyButtonDisabled = false;
          }, 3000);
        },
        function (err) {
          copyButtonText = "Error!";
          copyButtonDisabled = true;
        }
      );
    } else {
      copyButtonText = "Browser do not support Clipboard API";
      copyButtonDisabled = true;
    }
  } 

  // Reactive parsedweatherArr for rendering
  $: {
    $preParsedWeatherArr = Object.entries($preParsedWeather);
    weatherCopy = '';
    $preParsedWeatherArr.forEach(([key, value]) => {
      if (activeOptionsArr.includes(key)) {
        weatherCopy += value + '\n';
      }
    })
  }

  // Date Time
  const currentDateTime = dayjs();
  let date;
  let startTime;
  let duration;
  // Initialize date and time
  date = currentDateTime.format('YYYY-MM-DD');
  startTime = currentDateTime.startOf('hour').format('HH:mm');

  // GEOLOCATION
  let locateButtonText = "Locate";
  let latLon = '';
  const handleLocate = (event) => {
    event.preventDefault();
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 1800000
    };
    const error = (error) => {
      locateButtonText = `Allow location access to use (ERROR(${error.code}): ${error.message})`
      console.warn(`ERROR(${error.code}): ${error.message}`);

    }
    const success = (position) => {
      var coord = position.coords;
      console.log('Your current position is:');
      console.log(`Latitude : ${coord.latitude}`);
      console.log(`Longitude: ${coord.longitude}`);
      console.log(`More or less ${coord.accuracy} meters.`);
      console.log(position);
      latLon = `${position.coords.latitude},${position.coords.longitude}`
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  // latLon Parser 
  const getLatLon = () => {
    let commaIndex = latLon.indexOf(',');
    location.lat = latLon.slice(0, commaIndex);
    location.lon = latLon.slice(commaIndex + 1);
  }

  // Location Obj
  let location = {
    lat: null,
    lon: null
  }
  // Initial Time Object
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
  // Initial Weather Results Object
  let weatherResults = {
    start: null,
    end: null
  }

  let errorText;
  // Submit
  const handleGetWeather = async() => {
    $preStatus = 'loading';
    getLatLon();
    times.start.localTime = dayjs(date + ' ' + startTime, "YYYY-MM-DD HH:mm");
    times.end.localTime = dayjs(times.start.localTime).add(duration, "minute");
    try {
      times = await getTimezoneOffset(times, location);
      times = getUnixTimes(times);
      weatherResults = await getWeather(times, location, weatherResults)
    }catch(error) {
      $preStatus = 'error';
      errorText = error;
      return;
    }
 
    $preStatus = 'show'
    $preParsedWeather = parseWeather(times, weatherResults, $preParsedWeather);
  }
  const inputKeyup = event => {
    if (event.key === 'Enter') {
      handleGetWeather();
    }
  }

</script>


<div class="ui-container">
    <div class="full-width top-ui">
        <label for="latlon">
            Location <small>(Latitude, Longitude)</small>
        </label>
      <br />
      <input type="text" name="latlon" bind:value={latLon}/>
      <br />
    </div>

    <button class="preView-button" on:click={handleLocate}>{locateButtonText}</button>

    <div class="date-input full-width">
      <label for="date">Date</label>
      <br />
      <input type="date" name="date" id="date" bind:value={date}/>
    </div>
    <div class="left">
      <label for="startTime">Start Time</label>
      <br />
      <input type="time" name="startTime" id="startTime" bind:value={startTime}/>
    </div>
    <div class="right">
      <label for="duration">Duration <small>(minutes)</small></label>
      <br />
      <input 
        type="number" 
        name="duration" 
        id="duration" 
        min="0" 
        bind:value={duration}
        on:keyup={event => inputKeyup(event)}
        />
    </div>

    <button class="preView-button" type="submit" on:click={handleGetWeather}>Get Weather</button>

    <div class="full-width response-field weatherDisp">
      <div class="weather-center">
        <div>
          {#if $preStatus === 'init'}
            <p>Enter location, time, and duration and click "Get Weather"</p>
          {:else if $preStatus === 'loading'}
            Loading...
          {:else if $preStatus === 'error'}
            {errorText}
          {:else if $preStatus === 'show'}
            {#each $preParsedWeatherArr as [key, entry]}
              {#if activeOptionsArr.includes(key)}
                {#if entry && (key === 'icon' || key === 'attr')}
                  {@html entry}
                {:else if entry && key !== 'icon'}
                  <p>{entry}</p>
                {:else}
                  <p>None returned</p>
                {/if}
              {/if}
            {/each}
          {/if}
        </div>
          {#if $preStatus === 'show'}
            <button class="copy-button" on:click={copyToClipboard} class:disabled={copyButtonDisabled}>{copyButtonText}</button>
          {/if}
      </div>
    </div>
</div>

  <style>
    .ui-container {
        grid-template-rows: repeat(6, auto) 1fr;
    }
    .disabled {
      background-color: darkgray;
      color: white;
      cursor: default;
    }
    .left {
        grid-column: content-start / center-line;
    }
    .right {
        grid-column: center-line / content-end;
    }
    .preView-button {
      margin: 0;
    }
    button[type="submit"] {
      margin: 1rem 0;
    }
  </style>