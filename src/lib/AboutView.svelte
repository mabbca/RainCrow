<script>
    import { aboutView } from "../store";
</script>

<div class="about-container">
    <div class="menu-exit" on:click={()=> $aboutView = false}>🆇</div>
    <h2>Welcome to eBird Weather! 👋</h2>
    <p>Created by <a>Parker Davis</a></p>
    <section>
        <p>This is an app created for the quick retrieval of historical weather observations for eBird checklists</p>
        <p><a href="https://ebird.org/about">eBird</a> is a global citizen science bird database where users submit bird checklists for a time and place to contibute to a shared understanding of the worlds avian biodiversity.</p>
    </section>
    <section>
        <p>All weather data is provided by the <a href="https://openweathermap.org/">OpenWeather API</a></p>
        <p>There are limitations to the accuracy of any weather API. If you are gathering weather data for a location that is near a weather station it should work great. </p>
        <p>If you are in more remote areas, like deep in remote canyons or high on a mountain peak, the weather at that location is likely different than the closest weather station and therefore will not completely match up with the results provided here. </p>
    </section>
    <section>
        <p>If you have any comments, issues, or suggestions feel free to <a href="mailto:parkied@gmail.com">email me</a>!</p>
    </section>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero quibusdam placeat delectus quam facilis maiores magni, non dolorum, qui, earum dolores modi ipsa. Nisi, dignissimos eum modi numquam ipsam necessitatibus.</p>

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
        max-height: 95vh;
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
        margin-top: 1rem;
        border-top: 1px solid black;
    }
    p {
        margin-top: 0.5rem;
    }
</style>