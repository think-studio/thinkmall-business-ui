<template>
	<div class="nav-menus">
		<div
			@click="handleFullScreen"
			class="nav-menu-item"
			:class="isFullscreen ? 'hover' : ''"
		>
			<Icon
				v-if="isFullscreen"
				color="#000"
				class="nav-menu-icon"
				name="local-full-screen-cancel"
				size="18"
			/>
			<Icon
				v-else
				color="#000"
				class="nav-menu-icon"
				name="el-icon-FullScreen"
				size="18"
			/>
		</div>
		<el-popover
			placement="bottom-end"
			:hide-after="0"
			:width="260"
			trigger="click"
			popper-class="admin-info-box"
		>
			<template #reference>
				<div class="admin-info">
					<el-avatar :size="25" fit="fill">
						<img :src="userInfo?.avatar" alt="" />
					</el-avatar>
					<div class="admin-name">
						<el-tag
							style="margin-right: 8px"
							effect="dark"
							color="rgb(45, 183, 245)"
						>
							{{ userInfo?.nickName }}
						</el-tag>
						<el-tag effect="dark" color="rgb(135, 208, 104)">
							{{ userInfo?.deptName }}
						</el-tag>
					</div>
				</div>
			</template>
			<div>
				<div class="admin-info-base">
					<el-avatar :size="70" fit="fill">
						<img :src="userInfo?.avatar" alt="" />
					</el-avatar>
					<div class="admin-info-other">
						<div class="admin-info-name">{{ userInfo?.nickName }}</div>
					</div>
				</div>
				<div class="admin-info-footer">
					<el-button @click="handleAdminInfo" type="primary" plain>
						个人资料
					</el-button>
					<el-button @click="onLogout" type="danger" plain>退出登录</el-button>
				</div>
			</div>
		</el-popover>
	</div>
</template>

<script lang="ts" setup name="NavMenu">
import { useFullscreen } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { useUserStore } from '/@/store/modules/user';
import router from '/@/router';

const { isFullscreen, isSupported, toggle, exit } = useFullscreen();

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo?.user);

const onLogout = () => {
	userStore.confirmLoginOut();
};

function handleFullScreen() {
	if (!isSupported) {
		ElMessage.warning('当前浏览器不支持全屏');
	} else {
		isFullscreen.value ? exit() : toggle();
	}
}

function handleAdminInfo() {
	router.push({
		name: 'PersonData'
	});
}
</script>

<style scoped lang="scss">
.nav-menus {
	display: flex;
	align-items: center;
	// border-radius: var(--el-border-radius-base);
	// box-shadow: var(--el-box-shadow-light);
	background-color: #fff;

	.nav-menu-item {
		height: 100%;
		width: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		.nav-menu-icon {
			box-sizing: content-box;
			color: #000;
		}

		&:hover {
			.icon {
				animation: twinkle 0.3s ease-in-out;
			}
		}
	}

	.admin-info {
		display: flex;
		height: 100%;
		padding: 0 10px;
		align-items: center;
		cursor: pointer;
		user-select: none;
		color: #000;
	}

	.admin-name {
		padding-left: 6px;
	}
	.admin-name,
	.org-name {
		:deep(.el-tag) {
			border: none;
		}
	}

	.org-name {
		margin-right: 6px;
		cursor: pointer;
	}

	.nav-menu-item:hover,
	.admin-info:hover,
	.nav-menu-item.hover,
	.admin-info.hover {
		background: #f5f5f5;
	}
}

.admin-info-base {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	padding-top: 10px;

	.admin-info-other {
		display: block;
		width: 100%;
		text-align: center;
		padding: 10px 0;

		.admin-info-name {
			font-size: var(--el-font-size-large);
		}
	}
}

.admin-info-footer {
	padding: 10px 0;
	margin: 0 -12px -12px -12px;
	display: flex;
	justify-content: space-around;
}

@keyframes twinkle {
	0% {
		transform: scale(0);
	}

	80% {
		transform: scale(1.2);
	}

	100% {
		transform: scale(1);
	}
}
</style>
