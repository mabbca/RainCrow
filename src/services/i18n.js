import { dictionary, locale, _ } from 'svelte-i18n';

function setupI18n({
    withLocale: _locale
    } = {
        withLocale: 'en'
    }) {
    dictionary.set({
        en: {},
        fr: {},
    });

    locale.set(_locale);
}

export {
    _,
    setupI18n
};
