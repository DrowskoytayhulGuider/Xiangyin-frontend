<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <!--筛选栏-->
      <el-row v-show="showSearch" class="ml10">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList()">

          <el-form-item label="标准词形" prop="standardForm">
            <el-input v-model="state.queryForm.standardForm" placeholder="输入标准词形"
                      clearable style="width: 150px" @keyup.enter="getDataList()"/>
          </el-form-item>
          <el-form-item label="词性" prop="speechPart">
          <!--            <el-input v-model="state.queryForm.standardForm" placeholder="输入标准词形"-->
          <!--                      clearable style="width: 150px" @keyup.enter="getDataList()"/>-->
          <el-select v-model="state.queryForm.speechPart" placehoder="全部" clearable filterable style="width: 150px">
            <el-option v-for="o in speechPartList" :key="o" :label="o" :value="o"/>
          </el-select>
          </el-form-item>
          <el-form-item label="含义" prop="meaning">
            <el-input v-model="state.queryForm.meaning" placeholder="输入含义关键词"
                      clearable style="width: 150px" @keyup.enter="getDataList()"/>
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

          <el-button
              plain
              :disabled="multiple"
              icon="Delete"
              type="primary"

              @click="handleDelete(selectObjs)"
          >
            删除
          </el-button>

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
            prop="standardForm"
            label="正字法"
            show-overflow-tooltip
        />
        <el-table-column
            prop="speechPart"
            label="词性"
            show-overflow-tooltip
        />
        <el-table-column
            prop="meaning"
            label="含义"
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
        title="基础词表"
        :fields="listWordFields"
        :api="{ add: addListWord, update: putListWord,get: getBaseListWord}"
        @refresh="getDataList(false)"
    />

  </div>
</template>

<script setup lang="ts" name="systemListCharacter">
// ========== 导入声明 ==========
import { BasicTableProps, useTable } from "/src/hooks/table";
// import { fetchList, delObjs } from "/@/api/dialect/listCharacter";
import { useMessage, useMessageBox } from "/src/hooks/message";
// import { useDict } from '/@/hooks/dict';
import {
  fetchListWords,
  addListWord,
  putListWord,
  delListWords,
  getBaseListWord
} from '/src/api/dialect/baseListWord';
import {listWordFields} from "/@/views/dialect/baseList/wordList/fields";



// ========== 组件声明 ==========
// 异步加载表单弹窗组件
const FormDialog = defineAsyncComponent(
    () => import('/src/components/EntityFormDialog/index.vue')
);
// ========== 字典数据 ==========

// ========== 组件引用 ==========
const formDialogRef = ref();          // 表单弹窗引用
const queryRef = ref();               // 查询表单引用

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选

// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    standardForm:'',
    speechPart:'',
    meaning:''
  },    // 查询参数
  pageList: (param:any)=>{
    const {standardForm,speechPart,meaning,...rest}=param
    return fetchListWords({
      ...rest,//其中保留了分页参数
      standardForm:standardForm||undefined,
      speechPart:speechPart||undefined,
      meaning:meaning||undefined
    }
  )} //分页查询方法，包装参数
});

const speechPartList=['名词','动词','形容词','数词','量词','代词','副词','介词','连词','助词','语气词','叹词','拟声词']


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
    await delListWords(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
