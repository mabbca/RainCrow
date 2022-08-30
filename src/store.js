import { writable } from 'svelte/store';


export let postParsedWeather = writable({});

export let postParsedWeatherArr = writable([]);

export let postResultsShow = writable(false);

export let postIsLoading = writable(false);

export let postStatus = writable('init');

export let aboutView = writable(false);