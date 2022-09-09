<script>
  // Dayjs
  import dayjs from 'dayjs';

  // Props
  export let activeOptionsArr;
  export let temperatureUnit;
  export let iconType;
  export let windUnit;

  //Stores
  import { postParsedWeather, postParsedWeatherArr, postStatus, appName } from '../store';

  // Weather Functions
  import { parseWeather, getWeather, getUnixTimes, getTimezoneOffset, getChecklistInfo } from '../weatherFunctions';

  //Clipboard stuff, move elsewhere
  let weatherCopy = '';
  let copyButtonText = 'Copy to clipboard'
  let copyButtonDisabled = false;
  $: if($postStatus === 'loading') {
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

  // State

  let checklistId = '';
  let checklistInfo = {};
  $: {
    $postParsedWeatherArr = Object.entries($postParsedWeather);
    weatherCopy = '';
    $postParsedWeatherArr.forEach(([key, value]) => {
      if (activeOptionsArr.includes(key)) {
        if(key === 'temperature') {
          if (temperatureUnit === 'c') {
            weatherCopy += value.c + '\n';
          } else {
            weatherCopy += value.f + '\n';
          }
        } else if (key === 'icon') {
          if (iconType === 'emoji') {
            weatherCopy += value.emoji + '\n';
          } else {
            weatherCopy += value.open + '\n';
          }
        } else {
          weatherCopy += value + '\n';
        }
      }
    })
  }

  let errorTextOptions = [
    // "That doesn't seem like a real Checklist ID...",
    "Please enter a valid Checklist ID",
    // "Try again there, bud. eBird didn't like that input.",
  ]
  let errorText;

  // Weather Variables
  let weatherResults = {
    start: null,
    end: null
  }

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

  async function getWeatherHandler() {
      $postStatus = 'loading';
      checklistInfo = {};
      [checklistInfo, times] = await getChecklistInfo(checklistId);
      // eBird Error Handling
        if (checklistInfo.ok === false) {
          errorText = errorTextOptions[(Math.floor(Math.random() * errorTextOptions.length))];
          $postStatus = 'error';
          return;
        }
      // Historical Checklists Error
        if(checklistInfo.obsTimeValid === false) {
          $postStatus = 'error';
          errorText = "Historical checklists not supported. Need valid time to get weather data.";
          return;
        }
        if(dayjs(times.start.localTime).get('year') < 1979) {
          $postStatus = 'error';
          errorText="Dates before Jan 1, 1979 not supported by OpenWeather API."
          return;
        }
      try {
        times = await getTimezoneOffset(times, checklistInfo);
        times  = getUnixTimes(times);
        weatherResults = await getWeather(times, checklistInfo, weatherResults);
      } catch(error) {
        $postStatus = 'error';
        errorText = error;
        return;
      }
      $postStatus = 'show'
      $postParsedWeather = parseWeather(times, weatherResults, $postParsedWeather);
  }
  const inputKeyup = event => {
    if (event.key === 'Enter' && isChecklistId) {
      getWeatherHandler();
    }
  }

  let checklistRegex = /S\d{7}\d*/;
  $: isChecklistId = checklistId.match(checklistRegex);

</script>

<div class="ui-container">
    <div id="checklistInputForm" class="full-width top-ui">
      <label for="checklistID">Checklist ID:</label><br />
      <input
        type="text"
        name="checklistID"
        id="checklistID"
        class="full-width"
        bind:value={checklistId}
        on:keyup={event => inputKeyup(event)}
        on:focus={()=> checklistId = ''}
        class:error={!isChecklistId && checklistId.length > 0}
      />
    </div>
    <!-- add disable when !isChecklistId and when nothing is entered -->
    <button 
      id="submitButton" 
      on:click={getWeatherHandler}
      disabled={!isChecklistId}
    > 
      Get Weather
    </button>

    <div class="checklist-info full-width">
      {#if checklistInfo.checklistId}<p>{checklistInfo.checklistId}</p>{/if}
      {#if checklistInfo.locationName}<p>{checklistInfo.locationName}</p>{/if}
      {#if checklistInfo.startTime}<p>{checklistInfo.startTime}</p>{/if}
    </div>

    <div class="full-width">
      <div class="weather-center weatherDisp">
        <div>
          {#if $postStatus === 'init'}
            <p>Enter an eBird Checklist ID and click "Get Weather"</p>
          {:else if $postStatus === 'loading'}
            <div class="loading-text">Loading...</div>
          {:else if $postStatus === 'error'}
            {errorText}
          {:else if $postStatus === 'show'}

            {#each $postParsedWeatherArr as [key, entry]}

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

            {/each}

          {/if}
        </div>
          {#if $postStatus === 'show'}
            <button class="copy-button" on:click={copyToClipboard} class:disabled={copyButtonDisabled}>{copyButtonText}</button>
          {/if}
      </div>
    </div>

</div>

<style>
    .ui-container {
        grid-template-rows: repeat(4, auto) 1fr;
    }
    .disabled {
      background-color: darkgray;
      color: white;
      cursor: default;
    }
    .checklist-info {
      font-size: small;
      margin-top: 30px;
    }
    .loading-text {
      transform: rotate(0);
    }
    .error {
      border: 1px red solid;
    }

</style>