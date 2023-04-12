<template>
	<div class="task-git-container layout-padding">
		<div class="task-git-padding layout-padding-view layout-padding-auto">
			<TableSearch :search="state.searchData" @search="onSearch" @add="onAddBtnClick" />
			<el-table v-loading="state.tableLoading" :data="state.tableData">
				<el-table-column type="index" :index="indexMethod" label="序号" width="80" />
				<el-table-column prop="git_name" label="仓库名"></el-table-column>
				<el-table-column label="仓库地址">
					<template #default="{ row }">
						<el-link type="primary" :href="row.git_url" target="_blank">{{ row.git_url }}</el-link>
					</template>
				</el-table-column>
				<el-table-column label="仓库状态" width="200px">
					<template #default="{ row }">
						<span>{{ ['禁用', '启用'][+row.status] }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="150px">
					<template #default="{ row }">
						<el-link type="primary" @click="handleEditGit(row)">编辑</el-link>
						<el-link v-if="row.status == 1" type="primary" @click="handleDisableGit(row)">禁用</el-link>
						<el-link v-else type="primary" @click="handelAbleGit(row)">启用</el-link>
						<el-popconfirm title="您确认要删除该仓库？" @confirm="handleDelGit(row.git_id)">
							<template #reference>
								<el-link type="primary">删除</el-link>
							</template>
						</el-popconfirm>
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
		<action-dialog
			v-model:visible="actionState.visible"
			:action-type="actionState.type"
			:git-info="actionState.data"
			@refresh="onSearch"
		></action-dialog>
	</div>
</template>

<script setup lang="ts" name="taskUser">
import { defineAsyncComponent, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getGitList, setGitStatus, delGit } from '/@/api/task';
import ActionDialog from './actionDialog.vue';

const TableSearch = defineAsyncComponent(() => import('/@/views/task/git/search.vue'));

const state = reactive<TaskTableState>({
	total: 0,
	page: 1,
	pageSize: 20,
	filterParams: {},
	tableLoading: false,
	tableData: [],
	searchData: [
		{ label: '仓库名', prop: 'gitName', placeholder: '请输入仓库名', required: false, type: 'input' },
		{
			label: '仓库状态',
			prop: 'status',
			placeholder: '请选择仓库状态',
			required: false,
			type: 'select',
			options: [
				{ label: '启用', value: 1 },
				{ label: '禁用', value: 0 },
			],
		},
	],
});
const actionState = reactive<gitActionState>({
	visible: false,
	type: '',
	data: {},
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
	const res = await getGitList({
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
const onSearch = (data: EmptyObjectType = {}) => {
	state.page = 1;
	state.pageSize = 20;
	state.filterParams = data;
	getTableData();
};
// 新增仓库点击时回调
const onAddBtnClick = () => {
	actionState.type = 'add';
	actionState.data = {};
	actionState.visible = true;
};
// 编辑仓库
const handleEditGit = (row: EmptyObjectType) => {
	actionState.type = 'edit';
	actionState.data = row;
	actionState.visible = true;
};
// 禁用仓库
const handleDisableGit = async (row: EmptyObjectType) => {
	state.tableLoading = true;
	const res = await setGitStatus({
		id: row.git_id,
		status: 0,
	}).catch((e) => e);
	if (res.code == 200) {
		ElMessage.success('禁用成功');
		onSearch();
	} else {
		ElMessage.error(res.msg);
	}
};
// 启用仓库
const handelAbleGit = async (row: EmptyObjectType) => {
	state.tableLoading = true;
	const res = await setGitStatus({
		id: row.git_id,
		status: 1,
	}).catch((e) => e);
	if (res.code == 200) {
		ElMessage.success('启用成功');
		onSearch();
	} else {
		ElMessage.error(res.msg);
	}
};
// 删除仓库
const handleDelGit = async (id: number) => {
	const res = await delGit({ id }).catch((e) => e);
	if (res.code == 200) {
		onSearch();
		ElMessage.success('删除成功');
	} else {
		ElMessage.error(res.msg);
	}
};
</script>

<style scoped lang="scss">
.task-git-container {
	.task-git-padding {
		padding: 15px;
	}
	.table-footer {
		display: flex;
		justify-content: flex-end;
	}
	.el-link + .el-link {
		margin-left: 8px;
	}
}
</style>
