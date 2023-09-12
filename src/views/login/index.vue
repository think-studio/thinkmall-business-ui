<template>
	<div class="container">
		<div class="main">
			<img class="login_bg" src="../../assets/login_bg.png" alt="" />
			<div class="login">
				<img class="logo" src="../../assets/logo.png" alt="" />
				<div class="org-info">
					<img class="org-logo" src="../../assets/org_logo.png" />
					<!-- <p class="login_title">{{ orgInfo?.orgName }}</p> -->
				</div>

				<div class="code_login">
					<el-form
						ref="formRef"
						:model="formData"
						:rules="rules"
						label-width="0"
						status-icon
						@keypress.enter="handleSubmit"
					>
						<el-form-item prop="userName">
							<el-input
								v-model="formData.username"
								size="large"
								maxlength="11"
								placeholder="请输入账号"
								:prefix-icon="Iphone"
							></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input
								v-model="formData.password"
								size="large"
								type="password"
								show-password
								placeholder="请输入账号密码"
								:prefix-icon="MoreFilled"
							></el-input>
						</el-form-item>
					</el-form>
					<el-button
						class="login_btn"
						type="primary"
						size="large"
						:loading="loginLoading"
						@click="handleSubmit"
					>
						登录
					</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup name="Login">
import { ElForm, ElNotification } from 'element-plus';
import type { FormRules } from 'element-plus';
import { Iphone, MoreFilled } from '@element-plus/icons-vue';
import router from '/@/router';
import { useUserStore } from '/@/store/modules/user';

const formRef = ref<InstanceType<typeof ElForm>>();
const loginLoading = ref(false);

const formData = reactive({
	username: '',
	password: '',
	loginType: 1,
	code: 'xxx000111'
});

const rules = reactive<FormRules>({
	account: [
		{
			required: true,
			message: '请输入账号',
			trigger: 'blur'
		}
	],
	password: [
		{
			required: true,
			message: '请输入账号密码',
			trigger: 'blur'
		}
	]
});

function handleSubmit() {
	formRef.value?.validate((valid) => {
		if (valid) {
			loginLoading.value = true;
			useUserStore()
				.login(formData)
				.then((res: any) => {
					ElNotification({
						message: '登录成功',
						type: 'success'
					});
					router.push({
						name: 'Root'
					});
				})
				.finally(() => {
					loginLoading.value = false;
				});
		}
	});
}
</script>

<style lang="scss" scoped>
$mainColor: #468eec;
.container {
	width: 100vw;
	height: 100vh;
	padding: 100px 0;
	background-color: $mainColor;
	justify-content: center;
	display: flex;

	.login_bg {
		height: 100%;
		justify-self: self-start;
	}

	.main {
		position: relative;
		max-width: 1300px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		background-color: #fff;
		border-radius: 19px;
		.logo {
			position: absolute;
			left: 30px;
			top: 30px;
			width: 166px;
			height: 48px;
		}

		.login {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			padding: 30px;
			.org-info {
				display: flex;
				.org-logo {
					height: 50px;
				}
				.login_title {
					color: $mainColor;
					font-weight: blod;
					font-size: 28px;
				}
			}

			.code_login {
				// height: 400px;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 40px 0;

				// justify-content: center;
				:deep(.el-form-item) {
					margin-bottom: 30px;
				}

				:deep(.el-input__wrapper) {
					width: 300px !important;
					box-shadow: none;
					background-color: white !important;
					border-bottom: solid 1px
						var(--el-input-border-color, var(--el-border-color));
					border-radius: 0;
					padding: 1px 11px !important;
				}

				:deep(.el-form-item.is-error .el-input__wrapper) {
					border-bottom-color: var(--el-color-danger);
				}

				:deep(.el-input__suffix-inner) {
					display: flex;
					flex-direction: row-reverse;
				}

				.login_btn {
					width: 240px;
					margin-top: 30px;
				}
				.footer {
					color: #909399;
				}
			}

			.resiger_link {
				span {
					cursor: pointer;
					color: #169bd5;
				}
			}
		}
	}
}

:deep(.el-tabs__nav-wrap::after) {
	display: none;
}

:deep(.el-tabs__item) {
	width: 160px;
	text-align: center;
}

:deep(.el-tabs__active-bar) {
	width: 100px !important;
	margin-left: 20px;
}

:deep(.el-tab-pane) {
	display: flex;
	justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.bindingWechatDialog {
	display: flex;
	justify-content: center;
}

@media screen and (max-width: 1200px) {
	.login_bg {
		display: none;
	}

	.main {
		background: url('../../assets/login_bg.png') no-repeat;
		background-size: cover;
	}
}
</style>
