import { useAppStoreWithOut } from '/@/store/modules/app';
const appStore = useAppStoreWithOut();
const dictData = appStore.getDict;

export const formatDictByType = (type: string) => {
	const currentDict = dictData.find((item) => item.dictName === type);
	const dictList = currentDict ? currentDict.dataList : [];
	const labelValueHash: Recordable = {};
	for (const item of dictList) {
		labelValueHash[item.dictValue] = item.dictLabel;
	}
	return function (value: string | number | undefined) {
		if (value !== 0 && !value) {
			return undefined;
		} else {
			return labelValueHash[value + ''] || '无';
		}
	};
};
