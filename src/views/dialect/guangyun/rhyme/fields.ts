// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';
import {onomatopoeiaPlan} from "/@/views/dialect/guangyun/initial/fields";

/** 字表字 新增/修改 字段配置 */
// export const onomatopoeiaPlan=['潘悟云2023','untATR','未定拟音方案']
export const sheList=[
    { label: '通', value: '通' },
    { label: '江', value: '江' },
    { label: '止', value: '止' },
    { label: '遇', value: '遇' },
    { label: '蟹', value: '蟹' },
    { label: '臻', value: '臻' },
    { label: '山', value: '山' },
    { label: '效', value: '效' },
    { label: '果', value: '果' },
    { label: '假', value: '假' },
    { label: '宕', value: '宕' },
    { label: '梗', value: '梗' },
    { label: '曾', value: '曾' },
    { label: '流', value: '流' },
    { label: '深', value: '深' },
    { label: '咸', value: '咸' },
]
// export const articulationPlaces=['重唇','轻唇','舌头','舌上','牙','齿头','正齿','喉','半舌','半齿']
export const guangyunRhymeFields: FormField[] = [
    {
        prop: 'rhyme',
        label: '韵母',
        rules: [{ required: true, message: '请输入韵母', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'she',
        type:'select',
        label:'韵摄',
        //const rhymeSheOpts=['通','江','止','遇','蟹','臻','山','效','果','假','宕','梗','曾','流','深','咸'];
        options:sheList,
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入韵摄', trigger: 'blur' }],//blur失焦

    },
    {
        prop:'deng',
        type:'select',
        label:'等',
        options:[
            { label: '一等', value: '一等' },
            { label: '二等', value: '二等' },
            { label: '三等', value: '三等' },
            { label: '四等', value: '四等' },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入等', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'hu',
        type:'select',
        label:'呼',
        options:[
            { label: '开', value: '开' },
            { label: '合', value: '合' },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入等', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'rhymeEnd',
        type:'select',
        label:'韵尾类别',
        options:[
            { label: '阴声韵', value: '阴声韵' },
            { label: '阳声韵', value: '阳声韵' },
            { label: '入声韵', value: '入声韵' },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入韵尾类别', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'onomatopoeia1',
        label:onomatopoeiaPlan[0],
        // rules: [{ required: true, message: '请输入词性', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'onomatopoeia2',
        label: onomatopoeiaPlan[1],
    },
    {
        prop: 'onomatopoeia3',
        label: onomatopoeiaPlan[2],
    }
];
