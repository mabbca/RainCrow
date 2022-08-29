<script>
  // Components
  import PostView from './lib/PostView.svelte'
  import PreView from './lib/PreView.svelte'

  // Helpers
  import { capitolizeFirst, dataRange } from './helpers';

  // Stores
  import { 
    postParsedWeatherArr,
    postResultsShow
  } from './store.js';

  // State
  let viewingPost = true;
  let optionsView = false;
  let options = {
    conditions: true,
    temperature: true,
    windspeed: true,
    sunrise: true,
    sunset: false,
    cloudCover: false,
    humidity: false,
    icon: true
  }
  $: activeOptionsArr = Object
    .entries(options)
    .filter(([key, bool]) => bool)
    .map(([key, bool]) => {
    if (bool === true){
      return key;
    }
  })

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
    <div class="nav-item post-submit" on:click={()=> viewingPost = true} class:active="{viewingPost}">
      <p>Submitted</p>
    </div>
    <div class="nav-item pre-submit" on:click={()=> viewingPost = false} class:active="{!viewingPost}">
      <p>Pre-Submit</p>
    </div>
  </nav>

  {#if viewingPost}
  <PostView 
    activeOptionsArr={activeOptionsArr}
  />
  {:else}
  <PreView />
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
  {#if $postResultsShow}
  <div class="results-preview">
    <h3>Preview:</h3>
    {#if viewingPost}
      {#each $postParsedWeatherArr as [key, entry]}
        {#if activeOptionsArr.includes(key)}
          <p>{#if entry}{entry}{:else}None returned{/if}</p>
        {/if}
      {/each}
    {/if}
  </div>
  {/if}

  <div class="options-list">
    <div class="option-item">
      <input type="checkbox" name="conditions" id="conditions" bind:checked={options.conditions}>
      <label for="conditions">Conditions</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="temperature" id="temperature" bind:checked={options.temperature}>
      <label for="temperature">Temperature</label>
      <!-- <select name="temp-unit" id="temp-unit">
        <option value="f">F°</option>
        <option value="c">C°</option>
      </select> -->
    </div>
    <div class="option-item">
      <input type="checkbox" name="windspeed" id="windspeed" bind:checked={options.windspeed}>
      <label for="windspeed">Windspeed</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="cloudCover" id="cloudCover" bind:checked={options.cloudCover}>
      <label for="cloudCover">Cloud Cover (%)</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="humidity" id="humidity" bind:checked={options.humidity}>
      <label for="humidity">Humidity (%)</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="sunrise" id="sunrise" bind:checked={options.sunrise}>
      <label for="sunrise">Sunrise</label>
    </div>
    <div class="option-item">
      <input type="checkbox" name="sunset" id="sunset" bind:checked={options.sunset}>
      <label for="sunset">Sunset</label>
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
    min-height: 220px;
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
