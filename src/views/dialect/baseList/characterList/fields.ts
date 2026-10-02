// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';

/** 字表字 新增/修改 字段配置 */
export const listCharacterFields: FormField[] = [
    {
        prop: 'hanzi',
        label: '字形',
        rules: [{ required: true, message: '请输入字形', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'guangyunInitialId',
        label: '中古声母',
        type: 'select',
        options: initialOptions,                 // 函数：打开弹窗时才请求
        props: { filterable: true, clearable: true },   // 可搜索，声母多的时候很有用(select框的属性)
        rules: [{ required: true, message: '请选择中古声母', trigger: 'blur' }],
    },
    {
        prop: 'guangyunTone',
        label: '中古声调',
        type:"select",
        options:[
            { label: '阴平', value: '阴平' },
            { label: '阳平', value: '阳平' },
            { label: '阴上', value: '阴上' },
            { label: '阳上', value: '阳上' },
            { label: '阴去', value: '阴去' },
            { label: '阳去', value: '阳去' },
            { label: '阴入', value: '阴入' },
            { label: '阳入', value: '阳入' }
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请选择中古声调', trigger: 'blur' }]
    },
    { prop: 'meaning', label: '字义' },
    {
        prop:'guangyunRhymeId',//此字段决定的是 form 里叫什么、提交时 JSON 的 key 叫什么，也就是必须与后端的新增/修改接口实际接收的字段名相同
        label:'中古韵母',
        type:'select',
        options: rhymeOptions,
        props:{filterable: true,clearable: true},
        rules: [{required:true,message:'请选择中古韵母',trigger:'blur'}]
    },
    // { prop: 'characterListId', label: '所属字表', type: 'number', props: { min: 1, max: 1000 } },
    {
        prop: 'remark',
        label: '备注',
        type: 'textarea',
        span: 24, // 整行
        props: { rows: 3, maxlength: 200, showWordLimit: true },
    }

];
// @ts-ignore
import request from "/src/utils/request"
//作为基础表管理
export async function  initialOptions () {
    const data = (await request.get(`/dialect/guangyun/initial/details`)).data
    return (data??[]).map((e:any)=>({
        label:e.initial,value:e.id
    }))//返回需要的label:value字典。a??b：a为null或undefined?b:a
}
export async function rhymeOptions() {
    const data = (await request.get('/dialect/guangyun/rhyme/details')).data
    return (data??[]).map((e:any)=>({
        label:e.rhyme,value:e.id
    }))
}