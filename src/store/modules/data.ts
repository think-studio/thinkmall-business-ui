import { OrderInfoModel } from '/@/api/orders/model/orderInfoModel';
import { store } from '/@/store';

interface DataState {
	orderData?: OrderInfoModel;
}

export const useDataStore = defineStore('app-data', {
	state: (): DataState => ({
		orderData: undefined
	}),
	getters: {
		getOrderData(): Nullable<OrderInfoModel | undefined> {
			return this.orderData;
		}
	},
	actions: {
		setOrderData(orderData: OrderInfoModel | undefined) {
			this.orderData = orderData;
		}
	}
});

export function useDataStoreWithOut() {
	return useDataStore(store);
}
