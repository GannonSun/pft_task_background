import request from '/@/utils/request';

// 分页获取用户列表
export function getUserList(data: object) {
	return request({
		url: '/api/task/getUserListByPage',
		method: 'post',
		data,
	});
}

// 变更用户状态 禁用 启用
export function setUserStatus(data: object) {
	return request({
		url: '/api/task/setUserStatus',
		method: 'post',
		data,
	});
}

// 分页获取仓库列表
export function getGitList(data: object) {
	return request({
		url: '/api/task/getGitListByPage',
		method: 'post',
		data,
	});
}

// 获取仓库详情
export function getGitDetailed(data: object) {
	return request({
		url: '/api/task/getGitDetailed',
		method: 'post',
		data,
	});
}

// 变更仓库状态 禁用 启用
export function setGitStatus(data: object) {
	return request({
		url: '/api/task/setGitStatus',
		method: 'post',
		data,
	});
}

// 新增仓库
export function addGit(data: object) {
	return request({
		url: '/api/task/addGit',
		method: 'post',
		data,
	});
}

// 更新仓库信息
export function updateGit(data: object) {
	return request({
		url: '/api/task/updateGit',
		method: 'post',
		data,
	});
}

// 删除仓库
export function delGit(data: object) {
	return request({
		url: '/api/task/delGit',
		method: 'post',
		data,
	});
}
