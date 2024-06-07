import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { z } from 'zod';

const OptionSchema = z.object({
	mode: z.enum(['tower', 'minecart']).optional(),
	prependGamerule: z.boolean(),
	globalCoords: z.boolean(),
	clearSky: z.boolean(),
	downMotion: z.boolean(),
	chunks: z.number().int().positive(),
	offsetX: z.number().int(),
	offsetY: z.number().int(),
	offsetZ: z.number().int()
});

const defaultOptions: z.infer<typeof OptionSchema> = Object.freeze({
	mode: undefined,
	prependGamerule: false,
	globalCoords: true,
	clearSky: false,
	downMotion: true,
	chunks: 1,
	offsetX: 0,
	offsetY: 0,
	offsetZ: 0
});

function load() {
	if (browser) {
		try {
			const parsed = JSON.parse(localStorage.getItem('options') || '');
			return parsed;
		} catch (err) {
			console.error(`Unable to parse options: ${err}`);
			return defaultOptions;
		}
		// const { success, data, error } = OptionSchema.safeParse(localStorage.getItem('options'));
		// if (success) {
		// 	return data;
		// } else {
		// 	console.warn(`Error while parsing options from local storage: ${error}`);
		// 	return defaultOptions;
		// }
	}
	return Object.create(defaultOptions);
}

export const options = writable<typeof defaultOptions>(load());

export const optionError = writable('');

export function reset() {
	options.update((value) => {
		return { ...defaultOptions, mode: value.mode };
	});
}

options.subscribe((value) => {
	// console.log(value);
	const { success, error } = OptionSchema.safeParse(value);
	if (success) {
		optionError.set('');
	} else {
		console.log(error.format());
		optionError.set(error.issues.map((i) => `${i.path}: ${i.message}`).join(', '));
	}

	if (browser) localStorage.setItem('options', JSON.stringify(value));
});
