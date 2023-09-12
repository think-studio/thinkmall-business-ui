import reges from './reg';

type Validtor = (
	rule: any,
	value: any,
	callback: (error?: string | Error) => void,
	source: any,
	options: any
) => any | void;

export interface Validates {
	idCard: Validtor;
	email: Validtor;
	phone: Validtor;
	bankCardNo: Validtor;
	vin: Validtor;
	url: Validtor;
	numberSize: (min: number, max: number) => Validtor;
}
function factoryFn(reg: RegExp, message: string): Validtor {
	return (_: any, value: any, callback: any) => {
		if (reg.test(value) || !value) {
			callback();
		} else {
			callback(new Error(message));
		}
	};
}
export const valid: Validates = {
	idCard: factoryFn(reges.idCard, '请输入正确的身份证号码'),
	email: factoryFn(reges.email, '请输入正确的邮箱地址'),
	phone: factoryFn(reges.phone, '请输入正确的手机号码或座机号码'),
	bankCardNo: factoryFn(reges.bankCardNo, '请输入正确的银行卡号'),
	vin: factoryFn(reges.vin, '请输入正确的vin码'),
	url: factoryFn(reges.url, '请输入正确的链接地址'),
	numberSize: (min, max) => {
		return (_: any, value: any, callback: any) => {
			value = parseInt(value);
			if (isNaN(value)) {
				callback(new Error(`请输入数字`));
			}
			if (value >= min && value <= max) {
				callback();
			} else {
				callback(new Error(`请输入${min}到${max}之间的数字`));
			}
		};
	}
};
