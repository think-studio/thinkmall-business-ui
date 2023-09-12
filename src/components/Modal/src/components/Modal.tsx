import { ElDialog } from 'element-plus';

import { defineComponent, toRefs, unref, ref } from 'vue';
import { basicProps } from '../props';
import { useModalDragMove } from '../hooks/useModalDrag';
import { useAttrs } from '/@/hooks/core/useAttrs';
import { extendSlots } from '/@/utils/helper/tsxHelper';

export default defineComponent({
	name: 'Modal',
	inheritAttrs: false,
	props: basicProps,
	emits: ['close'],
	setup(props, { emit, slots }) {
		const { visible, draggable, destroyOnClose } = toRefs(props);
		const attrs = useAttrs();
		useModalDragMove({
			visible,
			destroyOnClose,
			draggable
		});

		const close = () => {
			emit('close');
		};

		return () => {
			const propsData = { ...unref(attrs), ...props } as Recordable;
			return (
				<ElDialog
					model-value={propsData.visible || false}
					{...propsData}
					onClose={close}
				>
					{extendSlots(slots)}
				</ElDialog>
			);
		};
	}
});
