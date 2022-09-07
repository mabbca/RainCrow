<script>
    import { aboutView } from "../store";
    export let appName;
</script>

<div class="about-container">
    <div class="menu-exit" on:click={()=> $aboutView = false}>🆇</div>
    <h2>Welcome to {appName}! 🌦</h2>
    <p class="attr">Created by <a href="https://parkerdavis.dev/" target="_blank">Parker Davis</a></p>

    <p>This web app was created for the quick retrieval of historical weather observations for <a href="https://ebird.org/about" target="_blank">eBird</a> checklists.</p>

    <section>
        <h3>Submitted</h3>
        <p>Use for checklists that have already been submitted to eBird. Just enter the Checklist ID (or the entire URL) and click <span>Get Weather</span>.</p>
    </section>

    <section>
        <h3>Pre-Submit</h3>
        <p>Use before a checklist is submitted. This is especially useful for including weather in shared checklists.</p>
        <details>
            <summary>
                <span>Locate</span> not working?
            </summary>
            <ul>
                <li>Check that location services are enabled.</li>
                <li>Make sure you allow access to your location.</li>
                <li>If clicking <span>Locate</span> does not prompt you to allow location access, try toggling the location preference off then on again.</li>
                <li>For iPhone the setting is found under Settings > Privacy > Location Services > (Browser of Choice) > Allow Location Access</li>
            </ul>
        </details>
    </section>

    <section>
        <h3>Options</h3>
        <p>The options menu allows you to select the weather data you want to include.</p>
        <p>In order for <strong>Weather Icons</strong> and <strong>Include Link</strong> options to show up on your eBird checklist, you must include &lt;HTML tags&gt; to embed the images or create the link. You don't need to worry about doing this yourself, the code is included when you click <span class="copy">Copy to Clipboard</span>. The images and link will display normally once you submit the copied code to your checklist comments.</p>
        <!-- <p>Click on <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img" target="_blank">&lt;img&gt;</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a" target="_blank">&lt;a&gt;</a> to learn more about these HTML tags on the Mozilla Web Documentation website.  -->
        <!-- <p>Learn more about the OpenWeather Icons <a href="https://openweathermap.org/weather-conditions#How-to-get-icon-URL" target="_blank">here</a>.</p> -->
    </section>

    <section>
        <h3>Weather Data</h3>
        <p>All weather data is provided by the <a href="https://openweathermap.org/" target="_blank">OpenWeather API.</a></p>
        <p>Weather data is gathered for both the start and end times of a checklist and automatically displayed as a range.</p>
        <p>There are limitations to the accuracy of any weather API. If you are gathering weather data for a location that is near a weather station it should work just fine. If the location is a remote area with unique microclimate (deep canyons, mountain peaks, open ocean etc.) results from the nearest weather station will not be <em>as</em> accurate. Use at your own discretion!</p>
    </section>

    <section>
        <p>If you have any comments, suggestions, bugs, feel free to email me at <a href="mailto:parker@birdsmakesound.com">parker@birdsmakesound.com</a>!</p>
    </section>

 
    <div class="center">
        <button on:click={()=> $aboutView = false}>CLOSE</button>
    </div>
</div>

<style>
    .about-container {
        background-color: white;
        position: fixed;
        width: 500px;
        max-width: 95%;
        max-height: 88vh;
        top: 50%;
        left: 50%;
        transform:translate(-50%, -50%);
        border: 1px black solid;
        padding: 1rem 2rem;
        overflow: scroll;
    }
    .center {
        text-align: center;
    }
    button {
        width: 200px;
    }
    section {
        margin-top: 2rem;
        /* border-top: 1px solid black; */
    }
    section p:first-of-type {
        margin-top: 0;
    }
    p,
    details {
        margin-top: 1rem;
    }
    .attr {
        margin-top: 0;
        font-size: 0.8rem;
    }
    summary {
        cursor: pointer;
    }
    span {
        background: #409100;
        color: white;
        padding: 3px 6px;
        border-radius: 5px;
    }
    .copy {
        background: #4A96D9;

    }
</style>