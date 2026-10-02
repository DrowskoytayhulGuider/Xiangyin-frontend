// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';

/** 字表字 新增/修改 字段配置 */
export const listWordFields: FormField[] = [
    {
        prop: 'standardForm',
        label: '标准词形',
        rules: [{ required: true, message: '请输入词形', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'speechPart',
        type:'select',
        label:'词性',
        options:[
            //['名词','动词','形容词','数词','量词','代词','副词','介词','连词','助词','语气词','叹词','拟声词']
            { label: '名词', value: '名词' },
            { label: '动词', value: '动词' },
            { label: '形容词', value: '形容词' },
            { label: '数词', value: '数词' },
            { label: '量词', value: '量词' },
            { label: '代词', value: '代词' },
            { label: '副词', value: '副词' },
            { label: '介词', value: '介词' },
            { label: '连词', value: '连词' },
            { label: '助词', value: '助词' },
            { label: '语气词', value: '语气词' },
            { label: '叹词', value: '叹词' },
            { label: '拟声词', value: '拟声词' },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入词性', trigger: 'blur' }],//blur失焦

    },
    {
        prop:'meaning',
        label:'含义',
        // rules: [{ required: true, message: '请输入词性', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'remark',
        label: '备注',
        type: 'textarea',
        span: 24, // 整行
        props: { rows: 3, maxlength: 200, showWordLimit: true },
    }
];
