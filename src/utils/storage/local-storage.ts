type LocalData<T> = {
	data?: T;
	expires: number | null;
};

export class LocalDataManager<T> {
	name: string = '';
	validity: number = 0;
	static _existNames: string[] = [];
	constructor(name: string, validity?: number) {
		// 抛出重复的名称错误
		const existNames = LocalDataManager._existNames;
		if (existNames.includes(name)) {
			throw `本地缓存错误：${name} 名称重复`;
		} else {
			existNames.push(name);
		}
		this.name = name;
		this.validity = validity ?? 0;
	}

	update(data: T) {
		const old = this.get();
		if (old && old instanceof Object && data instanceof Object) {
			data = Object.assign(old, data);
		}
		this.set(data);
	}

	get(): Nullable<T> {
		const data = getLocalData(this.name);
		if (data && (data.expires > Date.now() || !data.expires)) {
			return data.data;
		} else {
			this.clear();
			return null;
		}
	}

	// 设置
	set(data?: T, expires: number = 0) {
		let result: LocalData<T> = {
			data: data,
			expires: expires
		};
		if (this.validity) {
			result.expires = Date.now() + this.validity;
		}
		setLocalData<LocalData<T>>(this.name, result);
	}

	// 清理
	clear() {
		clearLocalData(this.name);
	}
}

LocalDataManager._existNames = [];

function getLocalData(name: string) {
	const data = localStorage.getItem(name);
	if (data) {
		return JSON.parse(data);
	} else {
		return data;
	}
}

function setLocalData<T>(name: string, data: T) {
	localStorage.setItem(name, JSON.stringify(data));
}

function clearLocalData(name: string) {
	localStorage.removeItem(name);
}
