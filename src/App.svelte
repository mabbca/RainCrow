<script>
  // Components
  import PostView from './lib/PostView.svelte'
  import PreView from './lib/PreView.svelte'
  import AboutView from './lib/AboutView.svelte';

  // Helpers
  import { capitolizeFirst, dataRange } from './helpers';
  import dayjs from 'dayjs';

  // Stores
  import { postParsedWeatherArr, postStatus, aboutView } from './store.js';

  // State
  let viewingPost = true;
  let optionsView = false;
  let options = {
    conditions: true,
    temperature: true,
    windspeed: true,
    sunrise: true,
    sunset: true,
    cloudCover: true,
    humidity: true,
    icon: true,
    attr: true,
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
  const toggleAbout = () => {
    $aboutView = !$aboutView;
  }

</script>

<div class="vertical-grid-container" class:blur={optionsView || $aboutView}>
  <div class="title">
    <h1>eBird Weather</h1>
  </div>
  <nav>
    <div class="nav-item post-submit" on:click={()=> viewingPost = true} class:active="{viewingPost}">
      <p>Submitted</p>
    </div>
    <div class="nav-item pre-submit" class:active="{!viewingPost}">
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

<!-- --------FOOTER-------- -->
  <footer>
    <div on:click={toggleAbout}>
      <!-- <p>Weather Data provided by <a href="#">OpenWeather</a></p>
      <p>Created by <a href="#">Parker Davis</a></p> -->
      <a><p>About</p></a>
    </div>
    <div>
      <button on:click={toggleOptions}>Options</button>
    </div>
  </footer>
</div>
<!-- --------ABOUT MENU-------- -->

{#if $aboutView}
<AboutView />
{/if}

<!-- --------OPTIONS MENU-------- -->
{#if optionsView}
<div class="options-container">
  <div class="menu-exit" on:click={toggleOptions}>🆇</div>
  <div class="options-scroll">
    {#if $postStatus === 'show'}
    <div class="results-preview weatherDisp">
      <h3>Preview:</h3>
      {#if viewingPost}
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
    {/if}

    <div class="options-list">
      <div class="option-item">
        <input type="checkbox" name="icon" id="icon" bind:checked={options.icon}>
        <label for="icon">Icons</label>
      </div>
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
      <div class="option-item">
        <input type="checkbox" name="attr" id="attr" bind:checked={options.attr}>
        <label for="attr">Include attribution</label>
      </div>
    </div>
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
    margin: 1rem;
  }
  footer button {
    background-color: whitesmoke;
    color: black;
    border: 1px black solid;
    cursor: pointer;
    margin: 1rem;
  }
  footer button:hover {
    background-color: lightgray;
  }
  .options-container * {
    /* border: 1px red dotted; */
  }
  .options-container {
    background-color: white;
    position: fixed;
    width: 500px;
    max-width: 95%;
    max-height: 95vh;
    /* height: 100%; */
    top: 50%;
    left: 50%;
    transform:translate(-50%, -50%);
    border: 1px black solid;
    padding: 1rem;

    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
    justify-items: center;
    overflow: scroll;
  }
  .options-list {
    overflow: scroll;
    /* min-width: 200px; */
  }
  .options-scroll {
    overflow: scroll;
    width: 100%;
  }
  .options-bottom {
    /* border-top: 1px black solid; */
  }
  .done-button {
    width: 200px;
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

  .results-preview {
    margin: auto;
    min-height: 220px;
    width: fit-content;
  }

</style>
