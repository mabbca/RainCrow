<script>
  // Props
  export let activeOptionsArr;

  //Stores
  import { postParsedWeather, postParsedWeatherArr, postResultsShow, postIsLoading, postStatus } from '../store';

  // Weather Functions
  import { parseWeather, getWeather, getUnixTimes, getTimezoneOffset, getChecklistInfo } from '../weatherFunctions';

  //Clipboard stuff, move elsewhere
  let weatherCopy = '';
  let copyButtonText = 'Copy to clipboard'
  let copyButtonDisabled = false;
  $: if($postIsLoading) {
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

  let checklistId;
  let checklistInfo = {};
  $: {
    $postParsedWeatherArr = Object.entries($postParsedWeather);
    weatherCopy = '';
    $postParsedWeatherArr.forEach(([key, value]) => {
      if (activeOptionsArr.includes(key)) {
        weatherCopy += value + '\n';
      }
    })
  }

  let errorTextOptions = [
    "That doesn't seem like a real Checklist ID...",
    "Please enter a valid Checklist ID",
    "Try again there, bud. eBird didn't like that input.",
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
        // Error Handling
        if (checklistInfo.ok === false) {
          errorText = errorTextOptions[(Math.floor(Math.random() * errorTextOptions.length))];
          $postStatus = 'error';
          return;
        }
      times = await getTimezoneOffset(times, checklistInfo);
      times  = getUnixTimes(times, checklistInfo);
      weatherResults = await getWeather(times, checklistInfo, weatherResults);
      $postStatus = 'show'
      $postParsedWeather = parseWeather(times, weatherResults, $postParsedWeather);
  }
  const inputKeyup = event => {
    if (event.key === 'Enter') {
      getWeatherHandler();
    }
  }

</script>

<div class="ui-container">
    <div id="checklistInputForm" class="full-width top-ui">
      <label for="checklistID">Input Checklist ID:</label><br />
      <input
        type="text"
        name="checklistID"
        id="checklistID"
        class="full-width"
        bind:value={checklistId}
        on:keyup={event => inputKeyup(event)}
        on:focus={()=> checklistId = ''}
      />
    </div>
    <button id="submitButton" on:click={getWeatherHandler}>
      Get Weather
    </button>

    <div class="checklist-info full-width">
      {#if checklistInfo.checklistId}<p>{checklistInfo.checklistId}</p>{/if}
      {#if checklistInfo.locationName}<p>{checklistInfo.locationName}</p>{/if}
      {#if checklistInfo.startTime}<p>{checklistInfo.startTime}</p>{/if}
    </div>

    <div class="response-field weatherDisp full-width">
      <div class="weather-center">
        <div>
          {#if $postStatus === 'init'}
            For most accurate results, wait at least one hour after you've
            stopped birding before using this tool.
          {:else if $postStatus === 'loading'}
            Loading...
          {:else if $postStatus === 'error'}
            {errorText}
          {:else if $postStatus === 'show'}
            {#each $postParsedWeatherArr as [key, entry]}
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

</style>