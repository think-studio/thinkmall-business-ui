<template>
	<div class="basic-upload">
		<div>
			<div
				class="upload-list__item"
				v-for="(file, index) in fileList"
				@mouseover="() => (showActions = index)"
				@mouseout="() => (showActions = -1)"
			>
				<transition name="el-fade-in">
					<div class="upload-actions" v-show="showActions === index">
						<el-icon class="delete-icon" @click="handleRemove(index)">
							<Delete />
						</el-icon>
					</div>
				</transition>
				<template v-if="file.localUrl">
					<UploadProgress
						class="upload-progress"
						v-if="file.percent && file.percent < 100"
						:percent="file.percent"
					></UploadProgress>
					<img v-if="isImage(file.suffix)" class="image" :src="file.localUrl" />
					<div class="file-suffix-content" v-else>{{ file.suffix }}</div>
				</template>
				<template v-else>
					<img class="image" v-if="isImage(file.fileUrl)" :src="file.fileUrl" />
				</template>
			</div>
		</div>
		<el-upload
			v-if="fileList.length < limit"
			v-bind="bindValue"
			:before-upload="handleBeforeUpload"
			:show-file-list="false"
			:http-request="handleOssUpload"
		>
			<div class="upload-card">
				<el-icon><Plus /></el-icon>
			</div>
		</el-upload>
	</div>
</template>

<script lang="ts" setup name="BasicUpload">
import { ElMessage } from 'element-plus';
import { omit } from 'lodash-es';
import { getOssUploadInfolApi, ossUploadApi } from '/@/api/basic/file';
import { Plus } from '@element-plus/icons-vue';
import UploadProgress from './components/Progress.vue';
import { useGlobSetting } from '/@/hooks/settings';

const { fileUrl: baseFileUrl } = useGlobSetting();

interface Props {
	maxSize?: number;
	limit?: number;
	accept?: string;
	folderName?: string;
	modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
	maxSize: 10,
	limit: 10,
	accept: '',
	folderName: 'deliver'
});

const emit = defineEmits(['update:modelValue', 'success']);

const showActions = ref(-1);

const fileList = ref<
	{
		localUrl?: string;
		suffix?: string;
		fileKey: string;
		fileUrl: string;
		percent?: number;
	}[]
>([]);

const bindValue = computed(() => {
	const value = { ...props };
	return omit(value, 'onChange');
});

function isImage(url?: string) {
	if (!url) return false;
	const type = url.split('.').at(-1);
	if (!type) return false;
	return ['png', 'PNG', 'jpeg', 'JPEG', 'JPG', 'jpg', 'gif', 'GIF'].includes(
		type
	);
}

function handleBeforeUpload(file: File) {
	const { size, type, name } = file;
	const { maxSize, accept } = props;
	const suffix = getFileSuffixByName(name);
	if (size > maxSize * 1024 ** 2) {
		ElMessage.error(`只能上传不超过${maxSize}MB的文件!`);
		return Promise.reject();
	}
	if (accept && !accept.includes(suffix)) {
		ElMessage.error(`只能上传${accept}格式的文件!`);
		return Promise.reject();
	}
}

function getFileSuffixByName(name: string) {
	return name.split('.').at(-1) || '';
}

watch(
	() => props.modelValue,
	(newV) => {
		if (!newV) {
			fileList.value = [];
		} else {
			if (unref(fileList).length) return;
			fileList.value = newV.split(',').map((item) => {
				return {
					fileUrl: baseFileUrl + item,
					fileKey: item
				};
			});
		}
	},
	{ immediate: true }
);

function handleRemove(index: number) {
	fileList.value.splice(index, 1);
}

async function handleOssUpload({ file }: any) {
	try {
		const { type, name } = file;
		const localUrl = await readFile(file);
		const res = await getOssUploadInfolApi({
			contentType: type,
			suffix: getFileSuffixByName(name),
			folderName: props.folderName
		});
		const { fileKey, fileUrl, uploadUrl } = res.data;
		fileList.value.push({
			localUrl: localUrl,
			suffix: getFileSuffixByName(name),
			fileKey: fileKey,
			fileUrl: fileUrl,
			percent: 0
		});
		ossUploadApi(
			uploadUrl,
			file,
			{ 'Content-Type': type },
			function onUploadProgress(progressEvent: ProgressEvent) {
				const percent =
					((progressEvent.loaded / progressEvent.total) * 100) | 0;
				if (unref(fileList).length) {
					fileList.value.at(-1)!.percent = percent;
				}
			}
		).then(() => {
			emitChange();
		});
	} catch (error) {}
}

function emitChange() {
	const fileKeys = unref(fileList).map((item) => {
		return item.fileKey;
	});
	emit('update:modelValue', fileKeys.join(','));
	emit('success');
}

function readFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = function (e) {
			resolve(e.target?.result as string);
		};
	});
}
</script>

<style scoped lang="scss">
.basic-upload {
	--el-upload-picture-card-size: 148px;
	display: flex;
	.upload-card,
	.upload-list__item {
		width: var(--el-upload-picture-card-size);
		height: var(--el-upload-picture-card-size);
		box-sizing: border-box;
		display: inline-flex;
		border-radius: 6px;
	}
	.upload-card {
		background-color: var(--el-fill-color-lighter);
		border: 1px dashed var(--el-border-color-darker);
		cursor: pointer;
		vertical-align: top;
		justify-content: center;
		align-items: center;
	}
	.upload-list__item {
		overflow: hidden;
		background-color: var(--el-fill-color-blank);
		border: 1px solid var(--el-border-color);
		margin: 0 8px 8px 0;
		.upload-actions {
			position: absolute;
			display: flex;
			width: calc(var(--el-upload-picture-card-size) - 1px);
			height: calc(var(--el-upload-picture-card-size) - 1px);
			background: rgba($color: #000000, $alpha: 0.3);
			border-radius: 6px;
			align-items: center;
			justify-content: center;
			.delete-icon {
				font-size: 24px;
				color: white;
			}
		}
		.upload-progress {
			position: absolute;
		}
		.image {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}
		.file-suffix-content {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24px;
		}
	}
}
</style>
