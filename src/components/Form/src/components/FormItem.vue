<script lang="tsx">
import {
	cloneDeep,
	isArray,
	isBoolean,
	isFunction,
	isNull,
	upperFirst
} from 'lodash-es';
import { PropType } from 'vue';
import { componentMap } from '../componentMap';
import { createPlaceholderMessage, setComponentRuleType } from '../helper';
import { ComponentType } from '../types';
import { FormActionType, FormProps, FormSchema } from '../types/form';
import { getSlot } from '/@/utils/helper/tsxHelper';

const inputItemTypes: ComponentType[] = [
	'InputNumber',
	'Input',
	'RadioButtonGroup'
];
export default defineComponent({
	name: 'BasicFormItem',
	inheritAttrs: false,
	props: {
		schema: {
			type: Object as PropType<FormSchema>,
			default: () => ({})
		},
		formProps: {
			type: Object as PropType<FormProps>,
			default: () => ({})
		},
		formModel: {
			type: Object as PropType<Recordable>,
			default: () => ({})
		},
		setFormModel: {
			type: Function as PropType<(key: string, value: any) => void>,
			default: null
		},
		allDefaultValues: {
			type: Object as PropType<Recordable>,
			default: () => ({})
		},
		formActionType: {
			type: Object as PropType<FormActionType>,
			default: () => ({})
		}
	},
	setup(props, { slots }) {
		const { schema } = toRefs(props);
		const getValues = computed(() => {
			const { formModel, schema, allDefaultValues } = props;
			return {
				field: schema.field,
				model: formModel,
				values: {
					...allDefaultValues,
					...formModel
				},
				schema
			};
		});

		const getComponentsProps = computed(() => {
			const { schema, formModel, formActionType } = props;
			let { componentProps = {} } = schema;
			if (isFunction(componentProps)) {
				componentProps =
					componentProps({ schema, formModel, formActionType }) ?? {};
			}
			return componentProps as Recordable;
		});

		const getDisable = computed(() => {
			const { disabled: globDisabled } = props.formProps;
			const { dynamicDisabled } = props.schema;
			const { disabled: itemDisabled = false } = unref(getComponentsProps);
			let disabled = !!globDisabled || itemDisabled;
			if (isBoolean(dynamicDisabled)) {
				disabled = dynamicDisabled;
			}
			if (isFunction(dynamicDisabled)) {
				disabled = dynamicDisabled(unref(getValues));
			}

			return disabled;
		});

		function getShow() {
			const { show, ifShow } = props.schema;
			let isShow = true;
			let isIfShow = true;

			if (isBoolean(show)) {
				isShow = show;
			}
			if (isBoolean(ifShow)) {
				isIfShow = ifShow;
			}
			if (isFunction(show)) {
				isShow = show(unref(getValues));
			}
			if (isFunction(ifShow)) {
				isIfShow = ifShow(unref(getValues));
			}
			return { isShow, isIfShow };
		}

		function handleRules() {
			const { rules: defRules = [], component, label, required } = props.schema;

			let rules = cloneDeep(defRules);

			const { rulesMessageJoinLabel: joinLabel = true } = props.formProps;
			const defaultMsg =
				createPlaceholderMessage(component!) + `${joinLabel ? label : ''}`;

			function validator(
				rule: any,
				value: any,
				callback: (error?: string | Error) => void,
				source: any,
				options: any
			) {
				const msg = rule.message || defaultMsg;
				if (value === undefined || isNull(value)) {
					// 空值
					return Promise.reject(msg);
				} else if (Array.isArray(value) && value.length === 0) {
					// 数组类型
					return Promise.reject(msg);
				} else if (typeof value === 'string' && value.trim() === '') {
					// 空字符串
					return Promise.reject(msg);
				} else if (
					typeof value === 'object' &&
					Reflect.has(value, 'checked') &&
					Reflect.has(value, 'halfChecked') &&
					Array.isArray(value.checked) &&
					Array.isArray(value.halfChecked) &&
					value.checked.length === 0 &&
					value.halfChecked.length === 0
				) {
					// 非关联选择的tree组件
					return Promise.reject(msg);
				}
				return Promise.resolve();
			}
			const getRequired = isFunction(required)
				? required(unref(getValues))
				: required;
			if ((!rules || rules.length === 0) && getRequired) {
				rules = [
					{
						required: getRequired,
						validator: validator as any,
						trigger: 'blur'
					}
				];
			}
			const requiredRuleIndex: number = rules.findIndex(
				(rule) =>
					Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
			);
			if (requiredRuleIndex !== -1) {
				const rule = rules[requiredRuleIndex];
				const { isShow } = getShow();
				if (!isShow) {
					rule.required = false;
					if (component) {
						if (!Reflect.has(rule, 'type')) {
							rule.type = component === 'InputNumber' ? 'number' : 'string';
							if (
								component.includes('Input') ||
								component.includes('Textarea')
							) {
								rule.whitespace = true;
							}
							setComponentRuleType(rule, component, '');
						}
					}
				}
			}
			return rules;
		}

		function renderComponent() {
			let {
				component,
				field,
				changeEvent = 'input',
				valueType,
				componentProps = {}
			} = props.schema;
			if (!component) {
				console.warn('没有定义组件');
				return null;
			}
			const isInput = inputItemTypes.includes(component);
			changeEvent = isInput ? 'input' : 'update:modelValue';
			const eventKey = `on${upperFirst(changeEvent)}`;
			const on = {
				[eventKey]: (...args: Nullable<Recordable>[]) => {
					const [e] = args;
					const target = e ? e.target : null;
					let value = target ? target.value : e;
					if (valueType === 'string') {
						value = String(value);
					} else if (valueType === 'number') {
						value = Number(value);
					} else if (valueType === 'boolean') {
						value = Boolean(value);
					}
					props.setFormModel(field, value);
				}
			};
			// 自定义监听事件
			const { schema, formModel, formActionType } = props;
			interface CustomEvent {
				fnName: string;
				cb(...args: Nullable<Recordable>[]): void;
			}
			if (isFunction(componentProps)) {
				componentProps =
					componentProps({ schema, formModel, formActionType }) ?? {};
			}
			if (isArray((componentProps as any).customEvent)) {
				(componentProps as any).customEvent.map((item: CustomEvent) => {
					on[item.fnName] = item.cb;
				});
			}
			const propsData: Recordable = {
				disabled: unref(getDisable),
				...unref(getComponentsProps)
			};

			const isCreatePlaceholder = !propsData.disabled;
			if (isCreatePlaceholder) {
				propsData.placeholder =
					unref(getComponentsProps).placeholder ||
					createPlaceholderMessage(component);
			}
			const bindValue: Recordable = {
				modelValue: unref(props.formModel[field])
			};
			const compAttr: Recordable = {
				...on,
				...propsData,
				...bindValue
			};

			const Comp = componentMap.get(component) as ReturnType<
				typeof defineComponent
			>;
			const Opt = componentMap.get('Option') as ReturnType<
				typeof defineComponent
			>;
			return component === 'Select' ? (
				<Comp {...compAttr}>
					{((componentProps as any).options || []).map((item: any) => (
						<Opt key={item.value} label={item.label} value={item.value}></Opt>
					))}
				</Comp>
			) : (
				<Comp {...compAttr} />
			);
		}

		function renderItem() {
			const { slot, field, label } = props.schema;
			const getContent = () => {
				return slot
					? getSlot(slots, slot, unref(getValues))
					: renderComponent();
			};

			return (
				<el-form-item label={label} prop={field} rules={handleRules()}>
					<div style='display: flex; flex: auto'>
						<div style='flex:1'>{getContent()}</div>
					</div>
				</el-form-item>
			);
		}

		return () => {
			const { colProps = {} } = props.schema;
			const { baseColProps = {} } = props.formProps;
			const realColProps = { ...baseColProps, ...colProps };
			const { isIfShow, isShow } = getShow();
			const values = unref(getValues);
			const getContent = () => {
				return renderItem();
			};
			return (
				isIfShow && (
					<el-col {...realColProps} v-show={isShow}>
						{getContent()}
					</el-col>
				)
			);
		};
	}
});
</script>

<style scoped lang="scss">
:deep(.el-select) {
	width: 100%;
}
</style>
