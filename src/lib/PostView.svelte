<script>
  // Props
  export let activeOptionsArr;

  //Stores
  import { 
    postParsedWeather, 
    postParsedWeatherArr,
    postResultsShow,
    postIsLoading
  } from '../store';

  // Weather Functions
  import { 
    parseWeather, 
    getWeather, 
    getUnixTimes, 
    getTimezoneOffset, 
    getChecklistInfo, 
  } from '../weatherFunctions';

  //Clipboard stuff, move elsewhere
  let weatherDisplay;
  let copyButtonText = 'Copy to clipboard'
  let copyButtonDisabled = false;
  $: if($postIsLoading) {
    copyButtonDisabled = false;
    copyButtonText = 'Copy to clipboard'
  }
  const copyToClipboard = () => {
    let text = weatherDisplay.innerText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
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
  $: $postParsedWeatherArr = Object.entries($postParsedWeather);

  // Weather Variables
  let weatherResults = {
    start: {},
    end: {}
  }

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

  async function getWeatherHandler() {
      $postIsLoading = true;
      [checklistInfo, times] = await getChecklistInfo(checklistId);
      times = await getTimezoneOffset(times, checklistInfo);
      times  = getUnixTimes(times, checklistInfo);
      weatherResults = await getWeather(times, checklistInfo, weatherResults);
      $postResultsShow = true;
      $postIsLoading = false;
      $postParsedWeather = parseWeather(times, weatherResults, $postParsedWeather);
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

    <div class="response-field full-width">
      <div>
        <div>
          {#if !$postResultsShow && $postIsLoading===false}

          For most accurate results, wait at least one hour after you've
          stopped birding before using this tool.

          {:else if $postIsLoading === true}

          Loading...

          {:else}

            <div bind:this={weatherDisplay}>
              {#each $postParsedWeatherArr as [key, entry]}
                {#if activeOptionsArr.includes(key)}
                 <p>{#if entry}{entry}{:else}None returned{/if}</p>
                {/if}
              {/each}
            </div>

          {/if}
        </div>
        {#if $postResultsShow && $postIsLoading === false}
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