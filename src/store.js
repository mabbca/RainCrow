import { writable } from 'svelte/store';

export let options = writable({
    conditions: true,
    temperature: true,
    temperatureUnit: 'f',
    windspeed: true,
    windUnit: 'description',
    windDirection: true,
    windDirectionType: 'text',
    sunrise: true,
    sunset: true,
    cloudCover: true,
    humidity: true,
    icon: true,
    iconType: 'emoji',
    attr: true,
})
export let temperatureUnit = writable('f');
export let iconType = writable('emoji');
export let windUnit = writable('description');
export let windDirectionType = writable('text');


export let postParsedWeather = writable({});
export let preParsedWeather = writable({});


export let postParsedWeatherArr = writable([]);
export let preParsedWeatherArr = writable([]);

export let postStatus = writable('init');
export let preStatus = writable('init');

export let aboutView = writable(false);