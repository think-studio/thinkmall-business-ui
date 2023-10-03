<template>
	<div>
		<el-upload
			v-bind="$attrs"
			ref="uploadRef"
			:action="action"
			:headers="uploadHeaders"
			:auto-upload="false"
			list-type="picture-card"
			:before-upload="handleBeforeUpload"
			:on-change="handleChange"
		>
			<slot></slot>
		</el-upload>
		<ImageCropper
			@register="registerModal"
			@success="handleCropperSuccess"
		></ImageCropper>
	</div>
</template>

<script lang="ts" setup name="BasicUpload">
import { useModal } from '/@/components/Modal';
import ImageCropper from './components/ImageCropper.vue';
import type {
	UploadFile,
	UploadUserFile,
	UploadInstance,
	UploadRawFile
} from 'element-plus';
import { useGlobSetting } from '/@/hooks/settings';
import { useUserStore } from '/@/store/modules/user';
import { genFileId } from 'element-plus';

interface Props {
	cropper?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	cropper: false
});

const { apiUrl } = useGlobSetting();
const token = useUserStore().getToken;
const action = apiUrl + '/upload';
const uploadHeaders = {
	Authorization: 'Bearer ' + token
};

const uploadRef = ref<UploadInstance>();
const fileList = ref<UploadUserFile[]>([]);
const [registerModal, { openModal }] = useModal();

function handleBeforeUpload() {}

function handleChange(file: UploadFile) {
	if (file.status === 'ready') {
		// 添加的文件
		openModal(true, {
			data: file.raw
		});
	}
}

// 裁剪成功
function handleCropperSuccess(file: UploadRawFile) {
	unref(uploadRef)?.clearFiles(['ready']);
	file.uid = genFileId();
	unref(uploadRef)?.handleStart(file);
	unref(uploadRef)?.submit();
}
</script>

<style lang="scss" scoped></style>
