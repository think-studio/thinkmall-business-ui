<template>
	<Modal
		v-bind="omit(getBindValue, 'height')"
		:fullscreen="fullScreenRef"
		@close="handleCancel"
	>
		<template #header v-if="!$slots.title">
			<div class="el-dialog__header-title">
				<ModalHeader
					:helpMessage="getProps.helpMessage"
					:title="getMergeProps.title"
					@dblclick="handleTitleDbClick"
				/>
				<Icon
					v-if="getProps.canFullscreen"
					style="cursor: pointer"
					color="#666"
					name="el-icon-FullScreen"
					size="18"
					@click="handleFullScreenChange"
				></Icon>
			</div>
		</template>

		<template #footer v-if="!$slots.footer">
			<ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
				<template #[item]="data" v-for="item in Object.keys($slots)">
					<slot :name="item" v-bind="data || {}"></slot>
				</template>
			</ModalFooter>
		</template>

		<template
			#[item]="data"
			v-for="item in Object.keys(omit($slots, 'default'))"
		>
			<slot :name="item" v-bind="data || {}"></slot>
		</template>

		<ModalWrapper
			:useWrapper="getProps.useWrapper"
			:footerOffset="wrapperFooterOffset"
			:fullScreen="fullScreenRef"
			ref="modalWrapperRef"
			:loading="getProps.loading"
			:loading-tip="getProps.loadingTip"
			:minHeight="getProps.minHeight"
			:height="getWrapperHeight"
			:visible="visibleRef"
			:modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
			:centered="getProps.centered"
			v-bind="
				omit(getProps.wrapperProps, 'visible', 'height', 'modalFooterHeight')
			"
			@ext-height="handleExtHeight"
			@height-change="handleHeightChange"
		>
			<slot></slot>
		</ModalWrapper>
	</Modal>
</template>
<script lang="ts">
import type { ModalProps, ModalMethods } from './typing';

import {
	defineComponent,
	computed,
	ref,
	watch,
	unref,
	watchEffect,
	toRef,
	getCurrentInstance,
	nextTick
} from 'vue';
import Modal from './components/Modal';
import ModalWrapper from './components/ModalWrapper.vue';
import ModalFooter from './components/ModalFooter.vue';
import ModalHeader from './components/ModalHeader.vue';
import { Icon } from '/@/components/Icon';
import { isFunction } from 'lodash-es';
import { deepMerge } from '/@/utils';
import { basicProps } from './props';
import { useFullScreen } from './hooks/useModalFullScreen';
import { omit } from 'lodash-es';
// import { useDesign } from '/@/hooks/web/useDesign';

export default defineComponent({
	name: 'BasicModal',
	components: { Modal, ModalWrapper, ModalFooter, ModalHeader, Icon },
	inheritAttrs: false,
	props: basicProps,
	emits: [
		'visible-change',
		'height-change',
		'cancel',
		'ok',
		'register',
		'update:visible',
		'fullScreenChange'
	],
	setup(props, { emit, attrs }) {
		const visibleRef = ref(false);
		const propsRef = ref<Partial<ModalProps> | null>(null);
		const modalWrapperRef = ref<any>(null);
		// const { prefixCls } = useDesign('basic-modal');

		// modal   Bottom and top height
		const extHeightRef = ref(0);
		const modalMethods: ModalMethods = {
			setModalProps,
			emitVisible: undefined,
			redoModalHeight: () => {
				nextTick(() => {
					if (unref(modalWrapperRef)) {
						(unref(modalWrapperRef) as any).setModalHeight();
					}
				});
			}
		};

		const instance = getCurrentInstance();
		if (instance) {
			emit('register', modalMethods, instance.uid);
		}

		// Custom title component: get title
		const getMergeProps = computed((): Recordable => {
			return {
				...props,
				...(unref(propsRef) as any)
			};
		});

		const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen(
			{
				modalWrapperRef,
				extHeightRef,
				wrapClassName: toRef(getMergeProps.value, 'wrapClassName')
			}
		);

		function handleFullScreenChange(e: Event) {
			handleFullScreen(e);
			emit('fullScreenChange');
		}

		// modal component does not need title and origin buttons
		const getProps = computed((): Recordable => {
			const opt = {
				...unref(getMergeProps),
				visible: unref(visibleRef),
				okButtonProps: undefined,
				cancelButtonProps: undefined,
				title: undefined
			};
			return {
				...opt,
				wrapClassName: unref(getWrapClassName)
			};
		});

		const getBindValue = computed((): Recordable => {
			const attr = {
				...attrs,
				...unref(getMergeProps),
				visible: unref(visibleRef),
				wrapClassName: unref(getWrapClassName)
			};
			if (unref(fullScreenRef)) {
				return omit(attr, ['height', 'title']);
			}
			return omit(attr, 'title');
		});

		const getWrapperHeight = computed(() => {
			if (unref(fullScreenRef)) return undefined;
			return unref(getProps).height;
		});

		watchEffect(() => {
			visibleRef.value = !!props.visible;
			fullScreenRef.value = !!props.fullscreen;
		});

		watch(
			() => unref(visibleRef),
			(v) => {
				emit('visible-change', v);
				emit('update:visible', v);
				instance && modalMethods.emitVisible?.(v, instance.uid);
				nextTick(() => {
					if (props.scrollTop && v && unref(modalWrapperRef)) {
						(unref(modalWrapperRef) as any).scrollTop();
					}
				});
			},
			{
				immediate: false
			}
		);

		// 取消事件
		async function handleCancel(e: Event) {
			e?.stopPropagation();
			// 过滤自定义关闭按钮的空白区域
			// if ((e.target as HTMLElement)?.classList?.contains(prefixCls + '-close--custom')) return;
			if (props.closeFunc && isFunction(props.closeFunc)) {
				const isClose: boolean = await props.closeFunc();
				visibleRef.value = !isClose;
				return;
			}

			visibleRef.value = false;
			emit('cancel', e);
		}

		/**
		 * @description: 设置modal参数
		 */
		function setModalProps(props: Partial<ModalProps>): void {
			// Keep the last setModalProps
			propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
			if (Reflect.has(props, 'visible')) {
				visibleRef.value = !!props.visible;
			}
			if (Reflect.has(props, 'fullscreen')) {
				fullScreenRef.value = !!props.fullscreen;
			}
		}

		function handleOk(e: Event) {
			emit('ok', e);
		}

		function handleHeightChange(height: string) {
			emit('height-change', height);
		}

		function handleExtHeight(height: number) {
			extHeightRef.value = height;
		}

		function handleTitleDbClick(e: Event) {
			if (!props.canFullscreen) return;
			e.stopPropagation();
			handleFullScreen(e);
		}

		return {
			handleCancel,
			getBindValue,
			getProps,
			handleFullScreen,
			fullScreenRef,
			getMergeProps,
			handleOk,
			visibleRef,
			omit,
			modalWrapperRef,
			handleExtHeight,
			handleHeightChange,
			handleTitleDbClick,
			getWrapperHeight,
			handleFullScreenChange
		};
	}
});
</script>
<style lang="scss" scoped>
.el-dialog__header-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
