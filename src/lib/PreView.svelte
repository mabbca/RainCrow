<script>
  //DayJS
  import dayjs from 'dayjs'

  // Components
  import WeatherDisplay from './WeatherDisplay.svelte';

  // Weather Functions
  import { getTimezoneOffset, getUnixTimes, getWeather, parseWeather } from '../weatherFunctions';
 
  // Stores
  import { preParsedWeather, preStatus, preWeatherCopy} from '../store';

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
      navigator.clipboard.writeText($preWeatherCopy).then(
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
  // $: {
  //   $preParsedWeatherArr = Object.entries($preParsedWeather);
  //   weatherCopy = '';
  //   $preParsedWeatherArr.forEach(([key, value]) => {

  //     if (activeOptionsArr.includes(key)) {
  //       if(key === 'temperature') {
  //         if (temperatureUnit === 'c') {
  //           weatherCopy += value.c + '\n';
  //         } else {
  //           weatherCopy += value.f + '\n';
  //         }
  //       } else if (key === 'icon') {
  //         if (iconType === 'emoji') {
  //           weatherCopy += value.emoji + '\n';
  //         } else {
  //           weatherCopy += value.open + '\n';
  //         }
  //       } else if (key==='windspeed') {
  //         if (windUnit === 'mph') {
  //           weatherCopy += value.mph + '\n';
  //         } else if (windUnit === 'ms') {
  //           weatherCopy += value.ms + '\n';
  //         } else if (windUnit === 'kmh') {
  //           weatherCopy += value.kmh + '\n';
  //         } else if (windUnit === 'description') {
  //           weatherCopy += value.description + '\n';
  //         } else if (windUnit === 'beaufort') {
  //           weatherCopy += value.beaufort + '\n';
  //         }
  //       } else {
  //         weatherCopy += value + '\n';
  //       }
  //     }

  //   })
  // }

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
    location.lat = latLon.slice(0, commaIndex).trim();
    location.lon = latLon.slice(commaIndex + 1).trim();
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

  // Submit & Error Handling
  let errorText;

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


  // Form Validation
  const latLonRegex = /\s*-?\d+\.\d+,\s*-?\d+\.\d+\s*/;
  const dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;
  const startTimeRegex = /\d{1,2}:\d{2}$/;
  $: formIsValid = (
    latLon.match(latLonRegex) &&
    date.match(dateRegex) &&
    startTime.match(startTimeRegex) &&
    typeof(duration) === 'number' &&
    duration >= 0
    );

  let latlonError = false;
  $: if (latLon.match(latLonRegex) && latLon.length > 0) {
    latlonError = false;
  }
  const latlonFocusout = () => {
    if(!latLon.match(latLonRegex)) {
      latlonError=true;
    }
  }
  let dateError = false;
  $: if (!date.match(dateRegex) && date.length > 0) {
    dateError = false;
  }
  const dateFocusout = () => {
    if(!date.match(dateRegex)) {
      dateError=true;
    }
  }
  let startTimeError = false;
  $: if (!startTime.match(startTimeRegex) && startTime.length > 0) {
    startTimeError = false;
  }
  const startTimeFocusout = () => {
    if(!startTime.match(startTimeRegex)) {
      startTimeError=true;
    }
  }
  let durationError = false;
  $: if (typeof(duration) === 'number' && duration !== undefined) {
    durationError = false;
  }
  const durationFocusout = () => {
    if(typeof(duration) !== 'number') {
      durationError=true;
    }
  }

  // class:error={!latLon.match(latLonRegex) && latLon.length > 0}
</script>


<div class="ui-container">
    <div class="full-width top-ui">
        <label for="latlon">
            Location <small>(Latitude, Longitude)</small>
        </label>
      <br />
      <input 
        type="text" 
        name="latlon" 
        bind:value={latLon} 
        on:focusout={latlonFocusout}
        class:error={latlonError}
        />
      {#if latlonError}
      <span class="error-message">Please enter valid decimal degree coordinates.</span>
      {/if}
    </div>
    
    <button class="preView-button locate" on:click={handleLocate}>{locateButtonText}</button>

    <div class="date-input full-width">
      <label for="date">Date</label>
      <br />
      <input 
        type="date" 
        name="date" 
        id="date" 
        bind:value={date}
        on:focusout={dateFocusout}
        class:error={dateError}
        />
        {#if dateError}
        <span class="error-message">Enter valid date in format: YYYY-MM-DD</span>
        {/if}
    </div>
    <div class="left">
      <label for="startTime">Start Time</label>
      <br />
      <input 
        type="time" 
        name="startTime" 
        id="startTime" 
        bind:value={startTime}
        on:focusout={startTimeFocusout}
        class:error={startTimeError}
        />
        {#if startTimeError}
        <span class="error-message">Enter valid start time in 24hr format: HH:MM</span>
        {/if}
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
        on:focusout={durationFocusout}
        class:error={durationError}
        />
        {#if durationError}
        <span class="error-message">Enter valid number of minutes greater than or equal to 0</span>
        {/if}
    </div>
    
    <button class="preView-button" type="submit" on:click={handleGetWeather} disabled={!formIsValid}>Get Weather</button>

    <div class="full-width">
      <div class="weather-center weatherDisp">
        <div>
          {#if $preStatus === 'init'}
            <!-- <p>Enter location, date, time, and duration and click "Get Weather"</p> -->
            <!-- <br> -->
            <p>Location services must be enabled to use "Locate" button.</p> 
          {:else if $preStatus === 'loading'}
            Loading...
          {:else if $preStatus === 'error'}
            {errorText}
          {:else if $preStatus === 'show'}
          <WeatherDisplay isPost={false} isPreview={false} />


<!-- 
            {#each $preParsedWeatherArr as [key, entry]}

            {#if activeOptionsArr.includes(key)}
              {#if entry && key === 'icon'}
                {#if iconType === 'emoji'}
                  <p>{entry.emoji}</p>
                {:else}
                  {@html entry.open}
                {/if}
              {:else if entry && key === 'attr'}
                {@html entry}
              {:else if entry && key === 'temperature'}
                {#if temperatureUnit === 'c'}<p>{entry.c}</p>
                  {:else}<p>{entry.f}</p>
                {/if}
              {:else if entry && key === 'windspeed'}
                {#if windUnit === 'mph'}
                  <p>{entry.mph}</p>
                {:else if windUnit === 'kmh'}
                  <p>{entry.kmh}</p>
                {:else if windUnit === 'ms'}
                  <p>{entry.ms}</p>
                {:else if windUnit === 'beaufort'}
                  <p>{entry.beaufort}</p>
                {:else if windUnit === 'description'}
                  <p>{entry.description}</p>
                {/if}
              {:else if entry}
                <p>{entry}</p>
              {:else}
                <p>None returned</p>
              {/if}
            {/if}

            {/each} -->

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
        grid-template-rows: repeat(7, auto) 1fr;
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
    .error {
      border: 1px red solid;
    }
    .error-message {
      font-size: small;
      color: red;
      margin: 0; 
      padding: 0;
      position: relative;
      bottom: 10px;
    }
  </style>