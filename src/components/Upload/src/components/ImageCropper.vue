<template>
	<BasicModal @register="registerModal" @ok="hanldeOk">
		<div class="container">
			<VueCropper
				ref="cropperRef"
				:img="image"
				fixedBox
				autoCrop
				:autoCropWidth="autoCropWidth"
				:autoCropHeight="autoCropHeight"
			></VueCropper>
		</div>
	</BasicModal>
</template>

<script lang="ts" setup name="ImageCropper">
import VueCropper from 'vue-cropper/src/vue-cropper.vue';
import { BasicModal, useModalInner } from '/@/components/Modal';

interface Props {
	autoCrop?: boolean;
	autoCropWidth?: number;
	autoCropHeight?: number;
}

const emit = defineEmits(['register', 'success']);

const props = withDefaults(defineProps<Props>(), {
	autoCrop: true,
	autoCropWidth: 100,
	autoCropHeight: 100
});

let fileName = '';

const cropperRef = ref<any>(null);
const image = ref('');
const [registerModal, { closeModal }] = useModalInner(({ data }) => {
	fileName = data.name;
	image.value = URL.createObjectURL(data);
});

function hanldeOk() {
	unref(cropperRef)?.startCrop();
	unref(cropperRef)?.getCropBlob((data: Blob) => {
		const file = new File([data], fileName);
		unref(cropperRef)?.stopCrop();
		emit('success', file);
		closeModal();
	});
}
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 400px;
}
</style>
