<script>
    export let isPost
    import { postParsedWeather, preParsedWeather, options} from "../store"
    import { _ } from '../services/i18n';
</script>

{#if $options.icon}
  {#if isPost}
    {#if $options.iconType === 'open'}
      {@html $postParsedWeather.icon.open}
    {:else if $options.iconType === 'emoji'}
      {$postParsedWeather.icon.emoji}
    {/if}
  {:else}
    {#if $options.iconType === 'open'}
      {@html $preParsedWeather.icon.open}
    {:else if $options.iconType === 'emoji'}
      {$preParsedWeather.icon.emoji}
    {/if}
  {/if}
{/if}

{#if $options.conditions}
    {#if isPost}
      {$postParsedWeather.conditions}
    {:else}
      {$preParsedWeather.conditions}
    {/if}
{/if}

{#if $options.temperature}
  {$_('weather.temperature')}:
    {#if isPost}
      {$options.temperatureUnit === 'c' ? $postParsedWeather.temperature.c : $postParsedWeather.temperature.f}
    {:else}
      {$options.temperatureUnit === 'c' ? $preParsedWeather.temperature.c : $preParsedWeather.temperature.f}
    {/if}
  
{/if}

{#if $options.windspeed}
  {$_('weather.wind')}: 
    {#if isPost}
      {#if $options.windUnit === 'description'}
        {$postParsedWeather.windspeed.description}
      {:else if $options.windUnit === 'beaufort'}
        Beaufort force {$postParsedWeather.windspeed.beaufort}
      {:else if $options.windUnit === 'mph'}
        {$postParsedWeather.windspeed.mph}
      {:else if $options.windUnit === 'kmh'}
        {$postParsedWeather.windspeed.kmh}
      {:else if $options.windUnit === 'ms'}
        {$postParsedWeather.windspeed.ms}
      {/if}
    {:else}
      {#if $options.windUnit === 'description'}
        {$preParsedWeather.windspeed.description}
      {:else if $options.windUnit === 'beaufort'}
        Beaufort force {$preParsedWeather.windspeed.beaufort}
      {:else if $options.windUnit === 'mph'}
        {$preParsedWeather.windspeed.mph}
      {:else if $options.windUnit === 'kmh'}
        {$preParsedWeather.windspeed.kmh}
      {:else if $options.windUnit === 'ms'}
        {$preParsedWeather.windspeed.ms}
      {/if}
    {/if}
{/if}

{#if $options.windDirection}
  {$_('weather.wind_direction')}: 
    {#if isPost}
      {#if $options.windDirectionType === 'arrow'}
        {$postParsedWeather.windDirection.arrow}
      {:else if $options.windDirectionType === 'text'}
        {$postParsedWeather.windDirection.text}
      {/if}
    {:else}
      {#if $options.windDirectionType === 'arrow'}
        {$preParsedWeather.windDirection.arrow}
      {:else if $options.windDirectionType === 'text'}
        {$preParsedWeather.windDirection.text}
      {/if}
    {/if}
{/if}

{#if $options.cloudCover}
  {$_('weather.cloud_cover')}:  
    {#if isPost}
      {$postParsedWeather.cloudCover}%
    {:else}
      {$preParsedWeather.cloudCover}%
    {/if}
{/if}

{#if $options.humidity}
  {$_('weather.humidity')}: 
    {#if isPost}
      {$postParsedWeather.humidity}%
    {:else}
      {$preParsedWeather.humidity}%
    {/if}
{/if}

{#if $options.sunrise}
  {$_('weather.sunrise')}: 
    {#if isPost}
      {$postParsedWeather.sunrise}
    {:else}
      {$preParsedWeather.sunrise}
    {/if}
{/if}

{#if $options.sunset}
  {$_('weather.sunset')}: 
    {#if isPost}
      {$postParsedWeather.sunset}
    {:else}
      {$preParsedWeather.sunset}
    {/if}
{/if}

{#if $options.attr}
  {@html $_('weather.generated_by')} 
{/if}