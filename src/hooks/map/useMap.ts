import { ref, shallowRef, onMounted, watchEffect } from 'vue';
import type { Ref } from 'vue';

import AMapLoader from '@amap/amap-jsapi-loader';

function loadAMap() {
	const aMapLoaded = ref<boolean>(false);
	window._AMapSecurityConfig = {
		securityJsCode: 'xxx'
	};
	onMounted(() => {
		AMapLoader.load({
			key: 'f5d304abcbf2d7e00d39f8a1d2b12414',
			version: '2.0',
			AMapUI: {},
			plugins: [
				'AMap.Geocoder',
				'AMap.AutoComplete',
				'AMap.GraspRoad',
				'AMap.MouseTool',
				'AMap.CircleEditor',
				'AMap.MoveAnimation'
			]
		}).then(() => {
			aMapLoaded.value = true;
		});
	});
	return aMapLoaded;
}

export function useMap(
	mapContainerRef: Ref<HTMLDivElement | undefined>,
	options?: Partial<AMap.MapOptions> | undefined
) {
	const mapRef = shallowRef<AMap.Map>();
	const aMapLoaded = loadAMap();
	watchEffect(() => {
		if (aMapLoaded.value && mapContainerRef.value) {
			mapRef.value = new AMap.Map(mapContainerRef.value, options);
		}
	});
	return mapRef;
}
