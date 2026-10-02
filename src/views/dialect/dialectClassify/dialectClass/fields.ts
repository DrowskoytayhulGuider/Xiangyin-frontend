// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';

export const planNames=[
    {label:'地图集二',value:1},
    {label:'音典',value:2},
    {label:'未定方案1',value:3},
    {label:'未定方案2',value:4},
]//这个地方用于回填到编辑新建窗口，value必须是number，不能是字符串
export const levels=[
    {label:'一级分区',value:1},
    {label:'二级分区',value:2},
    {label:'三级分区',value:3},
    {label:'四级分区',value:4},
    {label:'五级分区',value:5},
]

export const dialectClassFields: FormField[] = [
    {
        prop: 'plan',
        label: '分区方案',
        type:'select',
        options:planNames,
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请选择分区方案', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'name',
        label: '方言片名称',
        rules: [{ required: true, message: '请输入方言片名称', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'level',
        type:'select',
        label:'分区等级',
        options:levels,
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请选择分区等级', trigger: 'blur' }],//blur失焦

    },
    {
        prop:'classificationEvidence',
        label:'划分依据',
    },
    {
        prop:'colour',
        type:'color',
        label:'颜色',
        rules: [{ required: true, message: '请选择颜色', trigger: 'change' }],
    },
    {
        prop:'remark',
        label:"备注",
    },
];
