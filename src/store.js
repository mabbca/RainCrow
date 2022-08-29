import { writable } from 'svelte/store';

export let resultsShow = writable(false);

export let checklistId = writable('');

export let parsedWeather = writable({
    conditions: {
        show: true,
        display: ''
    },
    temperature: {
        show: true,
        display: ''
    },
    windspeed: {
        show: true,
        display: ''
    },
    sunrise: {
        show: true,
        display: ''
    },
    sunset: {
        show: true,
        display: ''
    },
    cloudCover: {
        show: false,
        display: ''
    },
    humidity: {
        show: false,
        display: ''
    }
  });

export let parsedWeatherArr = writable([]);