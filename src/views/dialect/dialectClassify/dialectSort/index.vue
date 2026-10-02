<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <!--筛选栏-->
      <el-row v-show="showSearch" class="ml10">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList()">

          <el-form-item label="分区方案" prop="plan">
            <el-select v-model="state.queryForm.plan" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in planNames" :key="o.label" :label="o.label" :value="o.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="一级分区" prop="topClassification">
            <el-select v-model="state.queryForm.topClassification" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in filterDialectClassInLevel(0)" :key="o.name" :label="o.name" :value="o.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分区" prop="secondClassification">
            <el-select v-model="state.queryForm.secondClassification" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in filterDialectClassInLevel(1)" :key="o.name" :label="o.name" :value="o.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="三级分区" prop="thirdClassification">
            <el-select v-model="state.queryForm.thirdClassification" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in filterDialectClassInLevel(2)" :key="o.name" :label="o.name" :value="o.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="四级分区" prop="fourthClassification">
            <el-select v-model="state.queryForm.fourthClassification" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in filterDialectClassInLevel(3)" :key="o.name" :label="o.name" :value="o.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="五级分区" prop="fifthClassification">
            <el-select v-model="state.queryForm.fifthClassification" placehoder="全部" clearable filterable style="width: 150px">
              <el-option v-for="o in filterDialectClassInLevel(4)" :key="o.name" :label="o.name" :value="o.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="过渡" prop="transitionDialectSortIds">
            <el-select v-model="state.queryForm.transitionDialectSortIds" placehoder="全部" clearable filterable multiple collapseTags style="width: 150px">
              <el-option v-for="o in baseDialectSortByPlan(state.queryForm.plan)" :key="o.label" :label="o.label" :value="o.value"/>
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
            prop="plan"
            label="分区方案"
            show-overflow-tooltip
        >
          <template #default="{row}">{{planNames[row.plan-1].label}}</template>
        </el-table-column>
        <el-table-column
            prop="topClassification"
            label="一级分类"
            show-overflow-tooltip
        />
        <el-table-column
            prop="secondClassification"
            label="二级分类"
            show-overflow-tooltip
        />
        <el-table-column
            prop="thirdClassification"
            label="三级分类"
            show-overflow-tooltip
        />
        <el-table-column
            prop="fourthClassification"
            label="四级分类"
            show-overflow-tooltip
        />
        <el-table-column
            prop="fifthClassification"
            label="五级分类"
            show-overflow-tooltip
        />
        <el-table-column
            prop="transitionDialectSort"
            label="过渡"
            show-overflow-tooltip
        >
          <template #default="{row}">
            <div v-if="row.transitionDialectSort?.length">
              <div v-for="(sub, i) in row.transitionDialectSort" :key="i" style="line-height: 1.4;">
                {{ getDialectSortFullName(sub) }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="colours"
            label="颜色"
            min-width="200"
        >
          <template #default="{row}">
            <ColourTag v-if="row.colours" :value="row.colours"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="sortExplanation"
            label="划分依据"
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
        title="方言分类"
        :fields="dialectSortFields"
        :api="{ add: addDialectSort, update: putDialectSort,get: getDialectSort}"
        @refresh="onRefresh"
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
  fetchDialectSort,
  addDialectSort,
  putDialectSort,
  delDialectSort,
  getDialectSort
} from '/src/api/dialect/dialectSort';
import {planNames} from "/@/views/dialect/dialectClassify/dialectClass/fields";
import {
  allClasses, baseDialectSortByPlan, baseDialectSortVOs,
  dialectSortFields,
  getDialectSortFullName, loadDialectSorts
} from "/@/views/dialect/dialectClassify/dialectSort/fields";
import {getDialectClass} from "/@/api/dialect/dialectClass";


// ========== 组件声明 ==========
// 异步加载表单弹窗组件
const FormDialog = defineAsyncComponent(
    () => import('/src/components/EntityFormDialog/index.vue')
);
const ColourTag = defineAsyncComponent(
    () => import('/src/components/ColourTag/index.vue')
);
// ========== 字典数据 ==========

// ========== 组件引用 ==========
const formDialogRef = ref();          // 表单弹窗引用
const queryRef = ref();               // 查询表单引用

// ========== 响应式数据 ==========
const showSearch = ref(true);         // 是否显示搜索区域
const selectObjs = ref([]) as any;    // 表格多选数据
const multiple = ref(true);           // 是否多选

const dialectClassInLevel=ref([])

onMounted(async () => {
  allClasses.value = (await getDialectClass())?.data ?? [];
  for (let i = 1; i <= 5; ++i)
    getDialectClass({level: i}).then(data => {
      dialectClassInLevel.value[i - 1] = data.data
    })
  await loadDialectSorts()
})
// 新增/修改成功后：强制重拉，再刷表格
const onRefresh = async () => {
  await loadDialectSorts(true);
  getDataList(false);
};
// ========== 表格状态 ==========
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    plan:'',
    topClassification:'',
    secondClassification:'',
    thirdClassification:'',
    fourthClassification:'',
    fifthClassification:'',
    transitionDialectSortIds:[],
  },    // 查询参数
  pageList: (param:any)=>{
    const {plan,topClassification,secondClassification,thirdClassification,fourthClassification,fifthClassification,transitionDialectSortIds,remark,...rest}=param
    // eslint-disable-next-line no-console
    return fetchDialectSort({
          ...rest,//其中保留了分页参数
          plan:plan||undefined,
          topClassification:topClassification||undefined,
          secondClassification:secondClassification||undefined,
          thirdClassification:thirdClassification||undefined,
          fourthClassification:fourthClassification||undefined,
          fifthClassification:fifthClassification||undefined,
          transitionDialectSortIds:transitionDialectSortIds||undefined,
        }
    )} //分页查询方法，包装参数
});

// 根据筛选框选中的plan来决定那些方言片方言分类能被筛选
const filterDialectClassInLevel=(index:number)=>{
  if(state.queryForm.plan==='')
    return dialectClassInLevel.value[index]
  return dialectClassInLevel.value[index].filter((e:any)=>{
    return e.plan===state.queryForm.plan
  })
}
const filterBaseDialectSortVOs=()=>{
  if(state.queryForm.plan==='')
    return baseDialectSortVOs.value
  return baseDialectSortVOs.value.filter((e:any)=>e.plan===state.queryForm.plan)
}

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
    await delDialectSort(ids);
    await loadDialectSorts(true);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
