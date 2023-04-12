<template>
	<el-dialog class="gitActionDialog" :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" width="40%" append-to-body>
		<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="125px">
			<el-form-item label="仓库名称" prop="git_name">
				<el-input class="formInput" v-model="ruleForm.git_name" />
			</el-form-item>
			<el-form-item label="仓库地址" prop="git_url">
				<el-input class="formInput" v-model="ruleForm.git_url" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialogFooter">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, nextTick } from 'vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { addGit, updateGit } from '/@/api/task';

const props = defineProps({
	visible: Boolean,
	actionType: {
		type: String,
		default: 'add',
	},
	gitInfo: {
		type: Object,
		default: () => ({}),
	},
});

const emit = defineEmits(['update:visible', 'refresh']);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
	git_name: '',
	git_url: '',
});
const rules = reactive<FormRules>({
	git_name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
	git_url: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
});

const dialogTitle = computed(() => {
	const actionTypeMap = {
		add: '新增仓库',
		edit: '编辑仓库',
	};
	return actionTypeMap[props.actionType];
});
const dialogVisible = computed({
	get: () => props.visible,
	set: (val) => {
		emit('update:visible', val);
	},
});

watch(dialogVisible, (val) => {
	if (val) {
		if (props.actionType === 'edit' && props.gitInfo) {
			nextTick(() => {
				ruleForm.git_name = props.gitInfo.git_name;
				ruleForm.git_url = props.gitInfo.git_url;
			});
		}
	} else {
		ruleFormRef.value && ruleFormRef.value.resetFields();
	}
});

const handleSubmit = () => {
	if (!ruleFormRef.value) return;
	ruleFormRef.value.validate(async (valid) => {
		if (valid) {
			const reqMap = {
				add: addGit,
				edit: updateGit,
			};
			const params = {
				...props.gitInfo,
				...ruleForm,
			};
			const res = await reqMap[props.actionType](params).catch((e: any) => e);
			if (res.code == 200) {
				ElMessage.success(`${dialogTitle.value}成功`);
				dialogVisible.value = false;
				emit('refresh');
			} else {
				ElMessage.error(res.msg);
			}
		}
	});
};
</script>

<style scoped lang="scss">
.gitActionDialog {
	.el-dialog__body {
		padding: 32px;
	}
	.formInput {
		width: calc(100% - 80px);
	}
}
</style>
