import { getAllDicApi } from '/@/api/system/dict/dict';
import { DictModel } from '/@/api/system/dict/model/dictModel';
import { store } from '/@/store';

interface AppState {
	dict: DictModel[];
}

export const useAppStore = defineStore('app', {
	state: (): AppState => ({
		dict: []
	}),
	getters: {
		getDict(): DictModel[] {
			return this.dict;
		}
	},
	actions: {
		setDictData() {
			getAllDicApi().then((res) => {
				this.dict = res.data;
			});
		}
	}
});

export function useAppStoreWithOut() {
	return useAppStore(store);
}
