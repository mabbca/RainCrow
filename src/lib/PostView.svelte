<script>
  import { resultsShow, checklistId, parsedWeatherArr } from '../store';
  
  export let getWeatherHandler;
  export let isLoading;
  export let checklistInfo;

  let results;
  let copyButtonText = 'Copy to clipboard'
  let copyButtonDisabled = false;
  $: if(isLoading) {
    copyButtonDisabled = false;
    copyButtonText = 'Copy to clipboard'
  }

  const copyToClipboard = () => {
    let text = results.innerText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        function () {
          copyButtonText = "Copied!";
          copyButtonDisabled = true;
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

</script>

<div class="ui-container">
    <div id="checklistInputForm" class="full-width top-ui">
      <label for="checklistID">Input Checklist ID:</label><br />
      <input
        type="text"
        name="checklistID"
        id="checklistID"
        class="full-width"
        bind:value={$checklistId}
        on:focus="{ () => $checklistId = '' }"
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
          {#if !$resultsShow && isLoading===false}
          For most accurate results, wait at least one hour after you've
          stopped birding before using this tool.
          {:else if isLoading === true}
          Loading...
          {:else}
            <div bind:this={results}>
              {#each $parsedWeatherArr as data}
                {#if data[1].show}<p>{#if data[1].display}{data[1].display}{:else}None returned{/if}</p>{/if}
              {/each}
            </div>
          {/if}
        </div>
        {#if $resultsShow && isLoading === false}
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