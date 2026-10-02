<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <!--筛选栏-->
      <el-row v-show="showSearch" class="ml10">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList()">
          <el-form-item label="字形" prop="hanzi">
            <el-input v-model="state.queryForm.hanzi" placeholder="请输入字形"
                      clearable style="width: 160px" @keyup.enter="getDataList()"/>
          </el-form-item>
          <el-form-item label="中古声母" prop="guangyunInitial.id">
            <el-select v-model="state.queryForm.guangyunInitial.id" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in initialOpts" :key="o.value" :label="o.label" :value="o.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="中古韵母" prop="guangyunRhyme.id">
            <el-select v-model="state.queryForm.guangyunRhyme.id" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in rhymeOpts" :key="o.value" :label="o.label" :value="o.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="韵摄" prop="guangyunRhyme.she">
            <el-select v-model="state.queryForm.guangyunRhyme.she" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in rhymeSheOpts" :key="o" :label="o" :value="o"/>
            </el-select>
          </el-form-item>
          <el-form-item label="等" prop="guangyunRhyme.deng">
            <el-select v-model="state.queryForm.guangyunRhyme.deng" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in ['一等','二等','三等','四等']" :key="o" :label="o" :value="o"/>
            </el-select>
          </el-form-item>
          <el-form-item label="呼" prop="guangyunRhyme.hu">
            <el-select v-model="state.queryForm.guangyunRhyme.hu" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in ['开','合']" :key="o" :label="o" :value="o"/>
            </el-select>
          </el-form-item>

          <el-form-item label="中古声调" prop="guangyunTone">
            <el-select v-model="state.queryForm.guangyunTone" placehoder="全部" clearable filterable style="width: 160px">
              <el-option v-for="o in ['阴平','阳平','阴上','阳上','阴去','阳去','阴入','阳入']" :key="o" :label="o" :value="o"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList()">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- 操作按钮区域 -->
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button 
            icon="folder-add" 
            type="primary" 
            class="ml10" 
            @click="formDialogRef.openDialog()">
            新增
          </el-button>
<!--          <el-button -->
<!--            plain -->
<!--            icon="upload-filled" -->
<!--            type="primary" -->
<!--            class="ml10" -->
<!--            @click="excelUploadRef.show()" >-->
<!--&lt;!&ndash;            v-auth="'dialect_listcharacter_add'"&ndash;&gt;-->
<!--            导入-->
<!--          </el-button>-->
          <el-button 
            plain 
            :disabled="multiple" 
            icon="Delete" 
            type="primary"

            @click="handleDelete(selectObjs)"
          >
            删除
          </el-button>
<!--          <right-toolbar -->
<!--            v-model:showSearch="showSearch" -->
<!--            :export="'dialect_listcharacter_export'"-->
<!--            @exportExcel="exportExcel" -->
<!--            class="ml10 mr20" -->
<!--            style="float: right;"-->
<!--            @queryTable="getDataList"-->
<!--          />-->
        </div>
      </el-row>

      <!-- 数据表格区域 -->
      <el-table 
        :data="state.dataList" 
        v-loading="state.loading" 
        border 
        :cell-style="tableStyle.cellStyle" 
        :header-cell-style="tableStyle.headerCellStyle"
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column type="index" label="#" width="40" />
        <el-table-column
          prop="hanzi"
          label="字形"
          show-overflow-tooltip
        />
        <el-table-column
          prop="guangyunInitial.initial"
          label="中古声母"
          show-overflow-tooltip
        />
        <el-table-column
          prop="guangyunTone"
          label="中古声调"
          show-overflow-tooltip
        />
        <el-table-column
          prop="meaning"
          label="字义"
          show-overflow-tooltip
        />
        <el-table-column
          prop="guangyunRhyme.rhyme"
          label="中古韵母"
          show-overflow-tooltip
        />
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              icon="edit-pen" 
              text 
              type="primary"
              @click="formDialogRef.openDialog(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button 
              icon="delete" 
              text 
              type="primary"
              @click="handleDelete([scope.row.id])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <pagination 
        @size-change="sizeChangeHandle" 
        @current-change="currentChangeHandle" 
        v-bind="state.pagination" 
      />
    </div>

    <!-- 编辑、新增弹窗 -->
    <FormDialog
        ref="formDialogRef"
        title="基础字表"
        :fields="listCharacterFields"
        :api="{ add: addListCharacter, update: putListCharacter,get: getBaseListCharacter}"
        @refresh="getDataList(false)"
    />

    <!-- 导入excel弹窗 (需要在 upms-biz/resources/file 下维护模板) -->
<!--    <upload-excel-->
<!--      ref="excelUploadRef"-->
<!--      title="导入"-->
<!--      url="/dialect/listCharacter/import"-->
<!--      temp-url="/admin/sys-file/local/file/listCharacter.xlsx"-->
<!--      @refreshDataList="getDataList"-->
<!--    />-->
  </div>
</template>

<script setup lang="ts" name="systemListCharacter">
// ========== 导入声明 ==========
import { BasicTableProps, useTable } from "/src/hooks/table";
// import { fetchList, delObjs } from "/@/api/dialect/listCharacter";
import { useMessage, useMessageBox } from "/src/hooks/message";
// import { useDict } from '/@/hooks/dict';
import { listCharacterFields, initialOptions,rhymeOptions } from './fields';
import {
  fetchListCharacters,
  addListCharacter,
  putListCharacter,
  delListCharacters,
  getBaseListCharacter
} from '/src/api/dialect/baseListCharacter';
// import {param} from "/@/stores/param";


/** 空值判断：undefined / null / 空串都算没填 */
const isBlank = (v: any) => v === undefined || v === null || v === '';

/**
 * 过滤掉所有为空的参数，并将guangyunInitial:[id:...]参数扁平化为guangyunInitial.id:...后返回
 *
 */
const flattenFilter = (prefix: string, obj?: Record<string, any>) => {
  const out: Record<string, any> = {};
  Object.keys(obj ?? {}).forEach((k) => {
    if (!isBlank(obj![k])) out[`${prefix}.${k}`] = obj![k];
  });
  return out;
};

// ========== 组件声明 ==========
// 异步加载表单弹窗组件
// const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const FormDialog = defineAsyncComponent(
    () => import('/src/components/EntityFormDialog/index.vue')
);
// ========== 字典数据 ==========

// ========== 组件引用 ==========
const formDialogRef = ref();          // 表单弹窗引用
// const excelUploadRef = ref();         // Excel上传弹窗引用
const queryRef = ref();               // 查询表单引用

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选

// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    hanzi:'',
    guangyunInitial: {id:undefined},
    guangyunRhyme:{id:undefined,she:'',deng:'',hu:''},
    guangyunTone:''
  },    // 查询参数
  pageList: (params:any)=>{
    const {hanzi,guangyunInitial,guangyunRhyme,guangyunTone,...rest}=params;
    return fetchListCharacters({
      ...rest,//其中保留了分页参数
      hanzi:hanzi||undefined,
      guangyunTone:guangyunTone||undefined,
      ...flattenFilter('guangyunInitial',guangyunInitial),
      ...flattenFilter('guangyunRhyme',guangyunRhyme)
    })
  } // 分页查询方法，包装参数
});
const initialOpts=ref<{label:string;value:number}[]>([]);
const rhymeOpts=ref<{label:string;value:number}[]>([]);
const rhymeSheOpts=['通','江','止','遇','蟹','臻','山','效','果','假','宕','梗','曾','流','深','咸'];
onMounted(async ()=>{
  initialOpts.value=await initialOptions()
  rhymeOpts.value=await rhymeOptions()
})

// ========== Hook引用 ==========
// 表格相关Hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state);

// ========== 方法定义 ==========
/**
 * 重置查询条件
 */
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields();
  // 清空多选
  selectObjs.value = [];
  // 重新查询
  getDataList();
};

/**
 * 导出Excel文件
 */
// const exportExcel = () => {
//   downBlobFile(
//     '/dialect/listCharacter/export',
//     { ...state.queryForm, ids: selectObjs.value },
//     'listCharacter.xlsx'
//   );
// };

/**
 * 表格多选事件处理
 * @param objs 选中的数据行
 */
const selectionChangeHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({ id }) => id);
  multiple.value = !objs.length;
};

/**
 * 删除数据处理
 * @param ids 要删除的数据ID数组
 */
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delListCharacters(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
