import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { configHtmlPlugin } from './build/vite/plugins/html';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { svgBuilder } from './src/components/Icon/src/svg/index';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	const root = process.cwd();
	const env = loadEnv(mode, root);
	const isBuild = command === 'build';

	const viteEnv = wrapperEnv(env);
	const { VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_PORT } =
		viteEnv;
	return {
		base: VITE_PUBLIC_PATH,
		root,
		plugins: [
			vue(),
			vueJsx(),
			vueSetupExtend(),
			svgBuilder('src/assets/icons/'),
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'],
				dts: 'src/auto-imports.d.ts',
				resolvers: [
					ElementPlusResolver(),
					IconsResolver({
						prefix: 'Icon'
					})
				]
			}),
			Components({
				resolvers: [
					ElementPlusResolver(),
					IconsResolver({
						enabledCollections: ['ep']
					})
				],
				dts: 'src/components.d.ts'
			}),
			Icons({
				autoInstall: true
			}),
			configHtmlPlugin(viteEnv, isBuild)
		],
		resolve: {
			alias: [
				{
					find: /\/@\//,
					replacement: pathResolve('src') + '/'
				},
				{
					find: /\/#\//,
					replacement: pathResolve('types') + '/'
				}
			]
		},
		server: {
			https: false,
			port: VITE_PORT,
			host: true,
			hmr: {
				overlay: false
			},
			proxy: createProxy(VITE_PROXY)
		},
		esbuild: {
			pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
		}
	};
});
