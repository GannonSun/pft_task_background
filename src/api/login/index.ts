import request from '/@/utils/request';

// 分页获取用户列表
export function login(data: object) {
	return request({
		url: '/api/task/adminLogin',
		method: 'post',
		data,
	});
}
