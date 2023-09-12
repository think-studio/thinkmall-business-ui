<template>
	<svg>
		<circle cx="70" cy="70" r="68"></circle>
		<circle cx="70" cy="70" r="68"></circle>
	</svg>
</template>

<script lang="ts" setup name="UploadProgress">
interface Props {
	percent: number;
}
const props = withDefaults(defineProps<Props>(), {
	percent: 0
});
</script>

<style lang="scss" scoped>
svg {
	width: 148px;
	height: 148px;

	transform: translate(3px, -3px) rotate(270deg);

	circle {
		width: 100%;
		height: 100%;
		fill: transparent;
		stroke-width: 4;
		stroke: #f2f3f5;

		&:nth-child(2) {
			stroke: #67c23a;
			stroke-dasharray: 440;
			stroke-dashoffset: calc(440 - (440 * v-bind('props.percent') / 100));
		}
	}
}
</style>
