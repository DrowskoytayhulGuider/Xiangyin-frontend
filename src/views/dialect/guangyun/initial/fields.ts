// @ts-ignore
import type { FormField } from '/src/components/EntityFormDialog/types';

/** 字表字 新增/修改 字段配置 */
export const onomatopoeiaPlan=['潘悟云2023','untATR','未定拟音方案']
export const voicingList=[
    { label: '全清', value: '0' },
    { label: '次清', value: '1' },
    { label: '全浊', value: '2' },
    { label: '次浊', value: '3' },
]
export const articulationPlaces=['重唇','轻唇','舌头','舌上','牙','齿头','正齿','喉','半舌','半齿']
export const guangyunInitialFields: FormField[] = [
    {
        prop: 'initial',
        label: '声母',
        rules: [{ required: true, message: '请输入声母', trigger: 'blur' }],//blur失焦
    },
    {
        prop:'voicing',
        type:'select',
        label:'清浊',
        options:[
            { label: '全清', value: 0 },
            { label: '次清', value: 1 },
            { label: '全浊', value: 2 },
            { label: '次浊', value: 3 },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入清浊', trigger: 'blur' }],//blur失焦

    },
    {
        prop:'articulationPlace',
        type:'select',
        label:'发音部位',
        //重唇，轻唇，舌头，舌上，牙，齿头，正齿，喉，半舌，半齿
        options:[
            { label: '重唇', value: '重唇' },
            { label: '轻唇', value: '轻唇' },
            { label: '舌头', value: '舌头' },
            { label: '舌上', value: '舌上' },
            { label: '牙', value: '牙' },
            { label: '齿头', value: '齿头' },
            { label: '正齿', value: '正齿' },
            { label: '喉', value: '喉' },
            { label: '半舌', value: '半舌' },
            { label: '半齿', value: '半齿' },
        ],
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请输入发音部位', trigger: 'blur' }],//blur失焦
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
