import type { ComputedRef } from 'vue';
import type { BasicTableProps, FetchParams } from '../types/table';
import { unref, computed } from 'vue';
import { FormProps } from '/@/components/Form/src/types/form';

export function useTableForm(
	propsRef: ComputedRef<BasicTableProps>,
	fetch: (opt?: FetchParams | undefined) => Promise<void>,
	getLoading: ComputedRef<boolean | undefined>
) {
	const getFormProps = computed((): Partial<FormProps> => {
		const { formConfig } = unref(propsRef);
		const { submitButtonOptions } = formConfig || {};
		return {
			...formConfig,
			submitButtonOptions: {
				btnText: '查询',
				loading: unref(getLoading),
				...submitButtonOptions
			}
		};
	});

	function handleSearchInfoChange(info: Recordable) {
		fetch({ searchInfo: info, page: 1 });
	}

	return {
		getFormProps,
		handleSearchInfoChange
	};
}
