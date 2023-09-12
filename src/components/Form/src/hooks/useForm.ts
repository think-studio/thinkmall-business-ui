import {
	FormActionType,
	FormProps,
	FormSchema,
	UseFormReturnType
} from '../types/form';
import { DynamicProps } from '/#/utils';
import { getDynamicProps } from '/@/utils';

type Props = Partial<DynamicProps<FormProps>>;

export function useForm(props?: Props): UseFormReturnType {
	const formRef = ref<Nullable<FormActionType>>(null);
	const loadedRef = ref<Nullable<boolean>>(false);

	async function getForm() {
		const form = unref(formRef);
		if (!form) {
			console.error('该form不存在');
		}
		await nextTick();
		return form as FormActionType;
	}
	function register(instance: FormActionType) {
		onUnmounted(() => {
			formRef.value = null;
			loadedRef.value = null;
		});
		if (unref(loadedRef) && instance === unref(formRef)) return;

		formRef.value = instance;
		loadedRef.value = true;

		watch(
			() => props,
			() => {
				props && instance.setProps(getDynamicProps(props));
			},
			{
				immediate: true,
				deep: true
			}
		);
	}

	const methods: FormActionType = {
		submit: async (): Promise<any> => {
			const form = await getForm();
			return form.submit();
		},
		validate: async (): Promise<Recordable> => {
			const form = await getForm();
			return form.validate();
		},
		clearValidate: async (name?: string | string[]) => {
			const form = await getForm();
			form.clearValidate(name);
		},
		setProps: async (formProps: Partial<FormProps>) => {
			const form = await getForm();
			form.setProps(formProps);
		},
		resetFields: async () => {
			getForm().then(async (form) => {
				await form.resetFields();
			});
		},
		getFieldsValue: <T>() => {
			return unref(formRef)?.getFieldsValue() as T;
		},
		updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
			const form = await getForm();
			form.updateSchema(data);
		},
		setFieldsValue: async (values: Recordable) => {
			const form = await getForm();
			form.setFieldsValue(values);
		},
		clearFormValues: async () => {
			const form = await getForm();
			form.clearFormValues();
		},
		initDefaultValues: async () => {
			const form = await getForm();
			form.initDefaultValues();
		}
	};
	return [register, methods];
}
