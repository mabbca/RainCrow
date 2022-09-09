<script>
    export let isPreview

</script>

<div class="weatherDisp" class:results-preview={isPreview}>
    {#if isPreview}<h3>Preview:</h3>{/if}
    {#if options.conditions}<p></p>{/if}
    {#if options.temperature}<p>Temperature: {temperatureUnit === 'c' ? temperatureC : temperatureF}</p>{/if}

    
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
  </div>