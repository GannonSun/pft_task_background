<template>
	<div class="task-user-container layout-padding">
		<div class="task-user-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.searchData" @search="onSearch" />
			<el-table v-loading="state.tableLoading" :data="state.tableData">
				<el-table-column type="index" :index="indexMethod" label="序号" width="80" />
				<el-table-column prop="user_name" label="用户名"></el-table-column>
				<el-table-column label="用户状态">
					<template #default="{ row }">
						<span>{{ ['禁用', '启用'][+row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100px">
					<template #default="{ row }">
						<el-link v-if="row.status == 1" type="primary" @click="handleDisableUser(row)">禁用</el-link>
						<el-link v-else type="primary" @click="handelAbleUser(row)">启用</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div class="table-footer mt15">
				<el-pagination
					v-model:current-page="state.page"
					v-model:page-size="state.pageSize"
					:total="state.total"
					layout="total, prev, pager, next, jumper"
					background
					@size-change="getTableData"
					@current-change="getTableData"
				>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="taskUser">
import { defineAsyncComponent, reactive, toRefs, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getUserList, setUserStatus } from '/@/api/task';

const TableSearch = defineAsyncComponent(() => import('/@/views/task/user/search.vue'));

const state = reactive<TaskTableState>({
	total: 0,
	page: 1,
	pageSize: 10,
	filterParams: {},
	tableLoading: false,
	tableData: [],
	searchData: [
		{ label: '用户名', prop: 'userName', placeholder: '请输入用户名', required: false, type: 'input' },
		{
			label: '用户状态',
			prop: 'status',
			placeholder: '请选择用户状态',
			required: false,
			type: 'select',
			options: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
		},
	],
});

onMounted(() => {
	getTableData();
});

// 自定义索引
const indexMethod = (index: number) => {
	return (state.page - 1) * state.pageSize + index + 1;
};
// 获取表格数据
const getTableData = async () => {
	state.tableLoading = true;
	const res = await getUserList({
		page: state.page,
		pageSize: state.pageSize,
		...state.filterParams,
	}).catch((e) => e);
	state.tableLoading = false;
	if (res.code == 200) {
		const data = res.data;
		state.tableData = data.list;
		state.total = data.total;
	}
};
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
	state.page = 1;
	state.pageSize = 10;
	state.filterParams = data;
	getTableData();
};
// 禁用用户
const handleDisableUser = async (row: EmptyObjectType) => {
	state.tableLoading = true;
	const res = await setUserStatus({
		id: row.user_id,
		status: 0,
	}).catch((e) => e);
	if (res.code == 200) {
		ElMessage.success('禁用成功');
		onSearch({});
	} else {
		ElMessage.error(res.msg);
	}
};
// 启用用户
const handelAbleUser = async (row: EmptyObjectType) => {
	state.tableLoading = true;
	const res = await setUserStatus({
		id: row.user_id,
		status: 1,
	}).catch((e) => e);
	if (res.code == 200) {
		ElMessage.success('启用成功');
		onSearch({});
	} else {
		ElMessage.error(res.msg);
	}
};
</script>

<style scoped lang="scss">
.task-user-container {
	.task-user-padding {
		padding: 15px;
	}
	.table-footer {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
