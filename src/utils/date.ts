import dayjs from 'dayjs';

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
	date: dayjs.Dayjs | undefined = undefined,
	format = DATE_TIME_FORMAT
): string {
	return dayjs(date).format(format);
}

export function formatToDate(
	date: dayjs.Dayjs | undefined = undefined,
	format = DATE_FORMAT
): string {
	return dayjs(date).format(format);
}

export const dateUtil = dayjs;

export const getGreet = () => {
	const now = new Date();
	const hour = now.getHours();
	let greet = '';

	if (hour < 5) {
		greet = '夜深了，注意你的身体';
	} else if (hour < 9) {
		greet = '早上好，欢迎回来！';
	} else if (hour < 12) {
		greet = '早上好，欢迎回来！';
	} else if (hour < 14) {
		greet = '中午好，欢迎回来！';
	} else if (hour < 18) {
		greet = '下午好，欢迎回来！';
	} else if (hour < 24) {
		greet = '晚上好，欢迎回来！';
	} else {
		greet = '你好，欢迎回来！';
	}
	return greet;
};
