import type { App } from 'vue';

const store = createPinia();

export function setUpStore(app: App<Element>) {
	app.use(store);
}

export { store };
