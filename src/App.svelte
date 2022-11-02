<script>
  // Components
  import PostView from './lib/PostView.svelte'
  import PreView from './lib/PreView.svelte'
  import AboutView from './lib/AboutView.svelte';
  import WeatherDisplay from './lib/WeatherDisplay.svelte';

  // Helpers
  import { capitalizeFirst, dataRange } from './helpers';
  import dayjs from 'dayjs';

  // Stores
  import { postStatus, aboutView, preStatus, options } from './store.js';

  // State
  let viewingPost = true;
  let optionsView = false;

  // Other Functions
  const toggleOptions = () => {
    optionsView = !optionsView;
  }
  const toggleAbout = () => {
    $aboutView = !$aboutView;
  }
  const menuEsc = (event) => {
    if (event.key === 'Escape') {
      optionsView = false;
      $aboutView = false;
    }
  }

</script>
<!-- --------START OF APP-------- -->
<svelte:window on:keydown={menuEsc}/>
<div class="vertical-grid-container" class:blur={optionsView || $aboutView}>
  <div class="title">
    <h1><span class="green">Rain</span>Crow</h1>
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
  <PostView />
  {:else}
  <PreView />
  {/if}

<!-- --------FOOTER-------- -->
  <footer>
    <div on:click={toggleAbout}>
      <!-- <p>Weather Data provided by <a href="#">OpenWeather</a></p>
      <p>Created by <a href="#">Parker Davis</a></p> -->
      <button class="about-button">About</button>
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

    {#if viewingPost && $postStatus === 'show'}
      <WeatherDisplay isPreview={true} isPost={true} />
    {:else if !viewingPost && $preStatus === 'show'}
      <WeatherDisplay isPreview={true} isPost={false} />
    {/if}

    <div class="options-list">
      <div class="option-item">
        <input type="checkbox" name="icon" id="icon" bind:checked={$options.icon}>
        <label for="icon">Weather Icons</label>
        <select name="icon-type" id="icon-type" bind:value={$options.iconType}>
          <option value="open">OpenWeather</option>
          <option value="emoji">Emoji</option>
        </select>
      </div>
      <div class="option-item">
        <input type="checkbox" name="conditions" id="conditions" bind:checked={$options.conditions}>
        <label for="conditions">Conditions</label>
      </div>
      <div class="option-item">
        <input type="checkbox" name="temperature" id="temperature" bind:checked={$options.temperature}>
        <label for="temperature">Temperature</label>
        <select name="temp-unit" id="temp-unit" bind:value={$options.temperatureUnit}>
          <option value="f">F°</option>
          <option value="c">C°</option>
        </select>
      </div>
      <div class="option-item">
        <input type="checkbox" name="windspeed" id="windspeed" bind:checked={$options.windspeed}>
        <label for="windspeed">Windspeed</label>
        <select name="wind-unit" id="wind-unit" bind:value={$options.windUnit}>
          <option value="description">Description</option>
          <option value="beaufort">Beaufort Scale</option>
          <option value="mph">mph</option>
          <option value="kmh">km/h</option>
          <option value="ms">m/s</option>
        </select>
      </div>
      <div class="option-item">
        <input type="checkbox" name="windDirection" id="windDirection" bind:checked={$options.windDirection}>
        <label for="windDirection">Wind Direction</label>
        <!-- <select name="windDirectionType" id="windDirectionType" bind:value={$options.windDirectionType}>
          <option value="arrow">Arrow</option>
          <option value="text">Text</option>
        </select> -->
      </div>
      <div class="option-item">
        <input type="checkbox" name="cloudCover" id="cloudCover" bind:checked={$options.cloudCover}>
        <label for="cloudCover">Cloud Cover (%)</label>
      </div>
      <div class="option-item">
        <input type="checkbox" name="humidity" id="humidity" bind:checked={$options.humidity}>
        <label for="humidity">Humidity (%)</label>
      </div>
      <div class="option-item">
        <input type="checkbox" name="sunrise" id="sunrise" bind:checked={$options.sunrise}>
        <label for="sunrise">Sunrise</label>
      </div>
      <div class="option-item">
        <input type="checkbox" name="sunset" id="sunset" bind:checked={$options.sunset}>
        <label for="sunset">Sunset</label>
      </div>
      <div class="option-item">
        <input type="checkbox" name="attr" id="attr" bind:checked={$options.attr}>
        <label for="attr">Include Link</label>
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
  .options-container {
    background-color: white;
    position: fixed;
    width: 400px;
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
    /* width: 100%; */
  }
  .done-button {
    width: 200px;
  }
  .option-item {
    padding: 5px 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }
  .option-item input {
    flex-grow: 0;
  }
  .option-item label {
    flex-grow: 1;
  }
  .about-button {
    border: none;
    background-color: white;
    color: #646cff;
  }
  .about-button:hover {
    background-color: inherit;
  }
  .green {
    color: #409100;
  }

</style>
