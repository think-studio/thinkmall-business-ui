import { RouteMeta } from 'vue-router';
import { Component } from '/@/router/types';

export interface MetaModel {
	currentActiveMenu?: string;
	hideMenu: boolean;
	hideTab: boolean;
	title: string;
	single: boolean;
}

export interface MenuModel {
	id: string;
	path: string;
	component: Component;
	currentActiveMenu: string;
	meta: MetaModel;
	name: string;
	redirect: string;
	children: MenuModel[];
	hideMenu: 'y' | 'n';
	hideTab: 'y' | 'n';
	icon: string;
	title: string;
	type: number;
}

export interface PermissionModel {
	permission: string;
}

export interface LoginResultModel {
	access_token: string;
	expires_in: number;
}

export interface UserInfoModel {
	tenantName: string;
	permissions: string[];
	roles: string[];
	user: User;
}

interface User {
	userId: number;
	tenantId: number;
	deptId: number;
	deptName: string;
	userName: string;
	nickName: string;
	userType: string;
	email: string;
	phonenumber: string;
	sex: string;
	avatar: string;
	password: string;
	status: string;
	loginIp: string;
	loginDate: string;
	dept: Dept;
	roles: any[];
	roleIds?: any;
	postIds?: any;
	postNames: any[];
	roleId?: any;
	createBy: string;
	updateBy?: any;
	remark: string;
	createTime: string;
	updateTime?: any;
	delFlag: boolean;
	tenantStatus?: any;
	tenantEndDate?: any;
	params?: any;
	platformAdmin: boolean;
	admin: boolean;
}

interface Dept {
	deptId: number;
	tenantId?: any;
	parentId: number;
	ancestors: string;
	deptName: string;
	orderNum: number;
	leader: string;
	phone?: any;
	email?: any;
	status: string;
	parentName?: any;
	children: any[];
	createBy?: any;
	updateBy?: any;
	createTime?: any;
	updateTime?: any;
	delFlag?: any;
	params?: any;
}

export interface BackRouteModel {
	name: string;
	path: string;
	hidden: boolean;
	redirect?: string;
	component: Component | string;
	alwaysShow?: boolean;
	meta: BackRouteMeta;
	children?: BackRouteModel[];
}

interface BackRouteMeta {
	title: string;
	icon: string;
	noCache: boolean;
	single: boolean;
}
