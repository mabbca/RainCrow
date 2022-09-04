<script>
    import { aboutView } from "../store";
    export let appName;
</script>

<div class="about-container">
    <div class="menu-exit" on:click={()=> $aboutView = false}>🆇</div>
    <h2>Welcome to {appName}! 🌦</h2>
    <p class="attr">Created by Parker Davis</p>

    <p>This web app was created for the quick retrieval of historical weather observations for eBird checklists.</p>
    <p><a href="https://ebird.org/about" target="_blank">eBird</a> is a global citizen science database where users submit checklists to contibute to a shared understanding of the world's bird life.</p>
    <section>
        <h3>Submitted</h3>
        <p>Use for checklists that have already been submitted to eBird. Just enter the Checklist ID and click <span>Get Weather</span>. You can find the Checklist ID at the top of the checklist page ("S73259373").</p>
    </section>
    <section>
        <h3>Pre-submit</h3>
        <p>Use before a checklist is submitted. This is especially useful for including weather in shared checklists.</p>
        <details>
            <summary>
                Locate Button not working?
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
        <h3>Weather Data</h3>
        <p>All weather data is provided by the <a href="https://openweathermap.org/" target="_blank">OpenWeather API.</a></p>
        <p>There are limitations to the accuracy of any weather API. If you are gathering weather data for a location that is near a weather station it should work just fine. If the location is a remote area with unique microclimate (deep canyons, mountain peaks, open ocean etc.) results from the nearest weather station will not be <em>as</em> accurate. Use at your own discretion!</p>
    </section>
    <section>
        <h3>Options</h3>
        <p>The options menu allows you to select the weather data you want to include. Some data will be more or less useful depending on the location.</p>
        <p><strong>Weather Icons</strong> includes HTML to embed OpenWeather icons in your eBird checklist comments.</p>
        <p><strong>Include Link</strong> includes a link to let people know where you got this super cool weather data.</p>
    </section>
    <section>
        <p>If you have any comments, suggestions, bugs, feel free to <a href="mailto:parkied@gmail.com">email me</a>!</p>
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
        padding: 2px 5px;
        border-radius: 5px;
    }
</style>