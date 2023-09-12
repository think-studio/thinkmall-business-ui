export function graspRoad(
	path: any[]
): Promise<{ newPath: any[]; totalMileage: number }> {
	if (path.length === 0) {
		return Promise.resolve({
			newPath: [],
			totalMileage: 0
		});
	}
	return new Promise((reslove, reject) => {
		AMap.plugin('AMap.GraspRoad', function () {
			var grasp = new (AMap as any).GraspRoad();
			grasp.driving(path, function (error: any, result: any) {
				if (!error) {
					let newPath = result.data.points.map((item: { x: any; y: any }) => {
						return {
							lngGd: item.x,
							latGd: item.y
						};
					});
					let totalMileage = result.data.distance / 1000;
					reslove({
						newPath,
						totalMileage
					});
				} else {
					reslove({
						newPath: [],
						totalMileage: 0
					});
				}
			});
		});
	});
}
