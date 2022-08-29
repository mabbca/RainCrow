<script>

</script>


<div class="ui-container">
    <div class="full-width top-ui">
        <label for="latlon">
            Location <small>(Latitude, Longitude)</small>
        </label>
      <br />
      <input type="text" name="latlon" />
      <br />
    </div>

    <button>Locate</button>

    <div class="date-input full-width">
      <label for="date">Date</label>
      <br />
      <input type="date" name="date" id="date" />
    </div>
    <div class="left">
      <label for="startTime">Start Time</label>
      <br />
      <input type="time" name="startTime" id="startTime" />
    </div>
    <div class="right">
      <label for="duration">Duration <small>(minutes)</small></label>
      <br />
      <input type="number" name="duration" id="duration" min="0" />
    </div>

    <button type="submit">Get Weather</button>

    <div class="full-width response-field">
      <div>
          For most accurate results, wait at least one hour after you've
          stopped birding before using this tool.
      </div>
      {#if $resultsShow}
      <button class="copy-button">Copy to clipboard</button>
      {/if}
    </div>
  </div>

  <style>
    .ui-container {
        grid-template-rows: repeat(6, auto) 1fr;
    }
    .left {
        grid-column: content-start / center-line;
    }
    .right {
        grid-column: center-line / content-end;

    }
  </style>