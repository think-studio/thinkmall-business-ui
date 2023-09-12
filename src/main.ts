import { createApp } from 'vue';
import App from './App.vue';
import { setUpStore } from './store';
import { setupGlobDirectives } from '/@/directives';
import router from './router';
import 'element-plus/dist/index.css';
import './styles/index.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import '@amap/amap-jsapi-types';
import mitt from './utils/mitt';

function bootstrap() {
	const app = createApp(App);
	app.use(router);
	setUpStore(app);

	// Register global directive
	setupGlobDirectives(app);

	app.config.globalProperties.eventBus = mitt();
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		app.component(key, component);
	}
	app.mount('#app');
}

bootstrap();
