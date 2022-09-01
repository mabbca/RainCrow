import { writable } from 'svelte/store';

export let appName = "RainCrow"

export let postParsedWeather = writable({});
export let preParsedWeather = writable({});

export let postParsedWeatherArr = writable([]);
export let preParsedWeatherArr = writable([]);

export let postStatus = writable('init');
export let preStatus = writable('init');

export let aboutView = writable(false);