import request from '/@/utils/request';

// 用户登录
export function login(data: object) {
	return request({
		url: '/api/task/adminLogin',
		method: 'post',
		data,
	});
}

// 获取用户信息
export function getUserInfo() {
	return request({
		url: '/api/task/getUserInfo',
		method: 'post',
	});
}
