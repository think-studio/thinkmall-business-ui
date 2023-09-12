<script lang="tsx">
import type { CSSProperties, PropType } from 'vue';
import { defineComponent, computed, unref } from 'vue';
import { ElTooltip } from 'element-plus';
import { Icon } from '/@/components/Icon';
import { isString, isArray } from 'lodash-es';
import { getSlot } from '/@/utils/helper/tsxHelper';

const props = {
	/**
	 * Whether to display the serial number
	 * @default: false
	 */
	showIndex: { type: Boolean },
	/**
	 * Help text font color
	 * @default: #ffffff
	 */
	color: { type: String, default: '#ffffff' },
	/**
	 * Help text font size
	 * @default: 14px
	 */
	fontSize: { type: String, default: '14px' },
	/**
	 * Help text list
	 */
	placement: { type: String, default: 'top' },
	/**
	 * Help text list
	 */
	text: { type: [Array, String] as PropType<string[] | string>, default: '' }
};

export default defineComponent({
	name: 'BasicHelp',
	components: { ElTooltip },
	props,
	setup(props, { slots }) {
		const prefixCls = 'basic-help';

		const getTooltipStyle = computed(
			(): CSSProperties => ({ color: props.color, fontSize: props.fontSize })
		);

		function renderTitle() {
			const textList = props.text;

			if (isString(textList)) {
				return <p>{textList}</p>;
			}

			if (isArray(textList)) {
				return (textList as string[]).map((text, index) => {
					return (
						<p key={text}>
							<>
								{props.showIndex ? `${index + 1}. ` : ''}
								{text}
							</>
						</p>
					);
				});
			}
			return null;
		}

		return () => {
			return (
				<ElTooltip
					popper-class={`${prefixCls}__wrap`}
					content={String(
						<div style={unref(getTooltipStyle)}>{renderTitle()}</div>
					)}
					placement={props.placement as 'right'}
					raw-content
				>
					<span class={prefixCls}>
						{getSlot(slots) || (
							<Icon color='#000' name='el-icon-InfoFilled' size='18'></Icon>
						)}
					</span>
				</ElTooltip>
			);
		};
	}
});
</script>
<style lang="scss"></style>
