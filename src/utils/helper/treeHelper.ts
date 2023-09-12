interface TreeHelperConfig {
	id: string;
	children: string;
	pid: string;
}

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
	id: 'id',
	children: 'children',
	pid: 'pid'
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) =>
	Object.assign({}, DEFAULT_CONFIG, config);

export function listToTree<T = any>(
	list: any[],
	config: Partial<TreeHelperConfig> = {}
): T[] {
	const conf = getConfig(config) as TreeHelperConfig;
	const nodeMap = new Map();
	const result: T[] = [];
	const { id, children, pid } = conf;

	for (const node of list) {
		node[children] = node[children] || [];
		nodeMap.set(node[id], node);
	}
	for (const node of list) {
		const parent = nodeMap.get(node[pid]);
		(parent ? parent[children] : result).push(node);
	}
	return result;
}

export function treeMap<T = any>(
	treeData: T[],
	opt: { children?: string; conversion: Fn }
): any[] {
	return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 */
export function treeMapEach(
	data: any,
	{ children = 'children', conversion }: { children?: string; conversion: Fn }
) {
	const haveChildren =
		Array.isArray(data[children]) && data[children].length > 0;
	const conversionData = conversion(data) || {};
	if (haveChildren) {
		return {
			...conversionData,
			[children]: data[children].map((i: number) =>
				treeMapEach(i, {
					children,
					conversion
				})
			)
		};
	} else {
		return {
			...conversionData
		};
	}
}
