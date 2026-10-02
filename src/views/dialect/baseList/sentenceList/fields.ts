// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';

/** 字表字 新增/修改 字段配置 */
export const listWordFields: FormField[] = [
    {
        prop: 'standardForm',
        type:'textarea',
        label: '短句内容',
        span:24,
        props: { rows: 3, maxlength: 200, showWordLimit: true },
        rules: [{ required: true, message: '请输入句子', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'remark',
        label: '备注',
        type: 'textarea',
        span: 24, // 整行
        props: { rows: 3, maxlength: 200, showWordLimit: true },
    }
];
