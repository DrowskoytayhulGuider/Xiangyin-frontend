<template>
  <el-dialog
      v-model="visible"
      :title="dialogTitle"
      :width="width"
      :close-on-click-modal="false"
      draggable
  >
    <el-form
        ref="formRef"
        :model="form"
        :rules="mergedRules"
        :label-width="labelWidth"
        v-loading="loading"
    >
      <el-row :gutter="gutter">
        <el-col
            v-for="field in visibleFields"
            :key="field.prop"
            :span="field.span ?? 12"
            class="mb20"
        >
          <el-form-item :label="field.label" :prop="field.prop">
            <!-- ① 自定义插槽：复杂控件（级联、上传、富文本）走这里，父组件只提供控件本身 -->
            <slot
                v-if="field.type === 'slot'"
                :name="field.slot || field.prop"
                :form="form"
                :field="field"
            />

            <!-- ② 下拉 -->
            <el-select
                v-else-if="field.type === 'select'"
                v-model="form[field.prop]"
                :placeholder="placeholderOf(field)"
                :disabled="disabledOf(field)"
                clearable
                style="width: 100%"
                v-bind="field.props"
            >
              <el-option
                  v-for="opt in optionsOf(field)"
                  :key="String(opt.value)"
                  :label="opt.label"
                  :value="opt.value"
                  :disabled="opt.disabled"
              />
            </el-select>

            <!-- ③ 单选（element-plus 2.6+ 用 :value） -->
            <el-radio-group
                v-else-if="field.type === 'radio'"
                v-model="form[field.prop]"
                :disabled="disabledOf(field)"
                v-bind="field.props"
            >
              <el-radio
                  v-for="opt in optionsOf(field)"
                  :key="String(opt.value)"
                  :value="opt.value"
              >
                {{ opt.label }}
              </el-radio>
            </el-radio-group>

            <!-- ④ 多选 -->
            <el-checkbox-group
                v-else-if="field.type === 'checkbox'"
                v-model="form[field.prop]"
                :disabled="disabledOf(field)"
                v-bind="field.props"
            >
              <el-checkbox
                  v-for="opt in optionsOf(field)"
                  :key="String(opt.value)"
                  :value="opt.value"
              >
                {{ opt.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- ⑤ 开关 -->
            <el-switch
                v-else-if="field.type === 'switch'"
                v-model="form[field.prop]"
                :disabled="disabledOf(field)"
                v-bind="field.props"
            />

            <!-- ⑥ 日期 / 日期时间 -->
            <el-date-picker
                v-else-if="field.type === 'date' || field.type === 'datetime'"
                v-model="form[field.prop]"
                :type="field.type"
                :value-format="field.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
                :placeholder="placeholderOf(field)"
                :disabled="disabledOf(field)"
                style="width: 100%"
                v-bind="field.props"
            />

            <!-- ⑦ 多行文本 -->
            <el-input
                v-else-if="field.type === 'textarea'"
                v-model="form[field.prop]"
                type="textarea"
                :rows="3"
                :placeholder="placeholderOf(field)"
                :disabled="disabledOf(field)"
                v-bind="field.props"
            />

            <!-- ⑧ 数字 -->
            <el-input-number
                v-else-if="field.type === 'number'"
                v-model="form[field.prop]"
                :placeholder="placeholderOf(field)"
                :disabled="disabledOf(field)"
                style="width: 100%"
                v-bind="field.props"
            />
            <!-- ⑨ 颜色 -->
            <div v-else-if="field.type === 'color'" class="color-field">
              <el-color-picker
                  v-model="form[field.prop]"
                  color-format="hex"
                  :disabled="disabledOf(field)"
                  v-bind="field.props"
                  :title="form[field.prop]"/>
              <span>{{ form[field.prop]||'未选择' }}</span>
            </div>


            <!-- ⑩ 默认：单行文本 -->
            <el-input
                v-else
                v-model="form[field.prop]"
                :placeholder="placeholderOf(field)"
                :disabled="disabledOf(field)"
                v-bind="field.props"
            />

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :disabled="loading" @click="onSubmit">确 认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="EntityFormDialog">
import { useMessage } from '/@/hooks/message';
import type { FormDialogApi, FormField, OptionItem } from './types';

// ========== props ==========
const props = withDefaults(
    defineProps<{
      /** 字段配置：决定这个弹窗长什么样 */
      fields: FormField[];
      /** 数据源（增/改/查详情） */
      api: FormDialogApi;
      /** 主键字段名 */
      idKey?: string;
      /** 标题：字符串，或 { add, edit } 分开配 */
      title?: string | { add?: string; edit?: string };
      width?: string;
      labelWidth?: string;
      gutter?: number;
      /** 提交时无条件附加的固定参数，如 { characterListId: 1 } */
      extraParams?: Record<string, any>;
      /** 详情接口返回数组时取第一条（兼容代码生成器的 /details） */
      detailIsArray?: boolean;
      /** 提交前钩子：可改写 payload；返回 false 中断提交 */
      beforeSubmit?: (payload: any, isEdit: boolean) => any | Promise<any>;
      /** 数据填充完成后的钩子 */
      afterOpen?: (form: Record<string, any>, row: any) => void | Promise<void>;
    }>(),
    {
      idKey: 'id',
      title: '',
      width: '720px',
      labelWidth: '90px',
      gutter: 24,
      detailIsArray: true,
    }
);

const emit = defineEmits(['refresh', 'success']);

// ========== 状态 ==========
const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const isEdit = ref(false);
const form = reactive<Record<string, any>>({});
const dynamicOptions = reactive<Record<string, OptionItem[]>>({});
const optionLoaded = reactive<Record<string, boolean>>({});

// ========== 计算属性 ==========
const dialogTitle = computed(() => {
  const t = props.title;
  if (t && typeof t === 'object') {
    return isEdit.value ? t.edit ?? '编辑' : t.add ?? '新增';
  }
  return `${isEdit.value ? '编辑' : '新增'}${t ?? ''}`;
});

/** 当前模式是否该显示这个字段 */
const inMode = (f: FormField) =>
    !f.mode || f.mode === 'both' || f.mode === (isEdit.value ? 'edit' : 'add');

/** 表单校验规则：只汇总"当前模式下存在"的字段 */
const mergedRules = computed(() => {
  const rules: Record<string, any[]> = {};
  props.fields.forEach((f) => {
    if (inMode(f) && f.rules?.length) rules[f.prop] = f.rules;   // ← 加 inMode
  });
  return rules;
});

/** 条件显示 */
const visibleFields = computed(() =>
    props.fields.filter((f) => inMode(f) && (!f.visible || f.visible(form)))   // ← 加 inMode
);


// ========== 小工具 ==========
const placeholderOf = (f: FormField) => f.placeholder ?? `请输入${f.label}`;

const disabledOf = (f: FormField) =>
    typeof f.disabled === 'function' ? f.disabled(form) : !!f.disabled;

const optionsOf = (f: FormField): OptionItem[] => {
  if (typeof f.optionsBy === 'function') return f.optionsBy(form) ?? [];  // ← 新增
  if (Array.isArray(f.options)) return f.options;
  return dynamicOptions[f.prop] ?? [];
};

/** 按字段类型给默认值 */
const buildEmptyForm = () => {
  const data: Record<string, any> = {};
  props.fields.forEach((f) => {
    if (f.defaultValue !== undefined) data[f.prop] = f.defaultValue;
    else if (f.type === 'number') data[f.prop] = undefined;
    else if (f.type === 'checkbox') data[f.prop] = [];
    else if (f.type === 'switch') data[f.prop] = false;
    else data[f.prop] = '';
  });
  return data;
};

/** 加载"函数式 options"（字典等），带缓存，只加载一次 */
const loadOptions = async () => {
  for (const f of props.fields) {
    if (typeof f.options !== 'function' || optionLoaded[f.prop]) continue;
    const list = await f.options();
    dynamicOptions[f.prop] = list ?? [];
    optionLoaded[f.prop] = true;
  }
};

const clearValidate = () => nextTick(() => formRef.value?.clearValidate());

const loadDetail = async (id: any) => {
  if (!props.api.get) return;
  loading.value = true;
  try {
    const res: any = await props.api.get({ [props.idKey]: id });
    const raw = res?.data;
    // 代码生成器的 /details 返回的是数组，取第一条
    const data = props.detailIsArray ? (Array.isArray(raw) ? raw[0] : raw) : raw;
    if (data) Object.assign(form, data);
    await props.afterOpen?.(form, data);
  } catch (e) {
    useMessage().error('获取详情失败');
  } finally {
    loading.value = false;
    clearValidate();
  }
};

// ========== 核心：打开 / 提交 ==========
/**
 * 打开弹窗
 * @param rowOrId 编辑时传：整行对象（省一次详情请求）或主键值；新增不传
 * @param preset  新增时的预填值，如 { characterListId: 3 }
 */
const openDialog = async (rowOrId?: any, preset?: Record<string, any>) => {
  visible.value = true;
  isEdit.value = false;

  // ① 重置表单（动态表单不能用 resetFields()，它记的是首次渲染时的初始值）
  Object.keys(form).forEach((k) => delete form[k]);
  Object.assign(form, buildEmptyForm(), preset ?? {});

  // ② 字典/选项按需加载
  await loadOptions();

  // ③ 编辑态取数
  if (rowOrId !== undefined && rowOrId !== null && rowOrId !== '') {
    isEdit.value = true;
    if (typeof rowOrId === 'object') {
      Object.assign(form, rowOrId); // 直接用行数据，不请求详情
      await props.afterOpen?.(form, rowOrId);
    } else {
      form[props.idKey] = rowOrId;
      await loadDetail(rowOrId);
    }
  }

  clearValidate();
};

const onSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    let payload: any = { ...form, ...(props.extraParams ?? {}) };
    if (props.beforeSubmit) {
      const ret = await props.beforeSubmit(payload, isEdit.value);
      if (ret === false) return; // 钩子里可中断提交
      if (ret) payload = ret;
    }

    if (isEdit.value) await props.api.update(payload);
    else await props.api.add(payload);

    useMessage().success(isEdit.value ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh', { isEdit: isEdit.value, form: payload });
    emit('success', { isEdit: isEdit.value, form: payload });
  } catch (err: any) {
    useMessage().error(err?.msg ?? '操作失败');
  } finally {
    loading.value = false;
  }
};


defineExpose({
  openDialog,
  closeDialog: () => (visible.value = false),
  getForm: () => form,
});
</script>
<style scoped>
.color-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>