import type {FormField} from '/@/components/EntityFormDialog/types';
import {planNames} from "/@/views/dialect/dialectClassify/dialectClass/fields";
import {fetchDialectSort} from "/@/api/dialect/dialectSort";

//先全量拉取所有dialectClass再筛选
export const allClasses=ref<any[]>([])
export const baseDialectSortVOs=ref([])
export const allDialectSorts = ref<any[]>([]);
let loadingSorts: Promise<void> | null = null;
const classesByPlanAndLevel=(plan:number,level:number)=> {
    return allClasses.value
        .filter((c: any) => c.plan === plan && c.level === level)
        .map((c: any) => ({label: c.name, value: c.id}))
}
export const getDialectSortFullName=(dialectSort:any)=>{
    let fullName=(dialectSort.topClassification??'')+(dialectSort.secondClassification?'-'+dialectSort.secondClassification:'')+
        (dialectSort.thirdClassification?'-'+dialectSort.thirdClassification:'') +(dialectSort.fourthClassification?'-'+
            dialectSort.fourthClassification:'')+(dialectSort.fifthClassification?'-'+dialectSort.fifthClassification:'')
    for(let subDialectSort of dialectSort.transitionDialectSort??[])
    {
        fullName+='\n'+(subDialectSort.topClassification??'')+(subDialectSort.secondClassification?'-'+subDialectSort.secondClassification:'')+
            (subDialectSort.thirdClassification?'-'+subDialectSort.thirdClassification:'') +(subDialectSort.fourthClassification?'-'+
                subDialectSort.fourthClassification:'')+(subDialectSort.fifthClassification?'-'+subDialectSort.fifthClassification:'')
    }
    return fullName
}
export const loadDialectSorts = (force = false) => {
    if (!force && allDialectSorts.value.length) return Promise.resolve();
    return (loadingSorts ??= (async () => {
        const all: any[] = [];
        let current = 1;
        for (;;) {
            const res: any = await fetchDialectSort({ current, size: 100 });
            const records = res?.data?.records ?? [];
            all.push(...records);
            const total = res?.data?.total ?? 0;
            if (records.length === 0 || all.length >= total) break;
            current++;
        }
        allDialectSorts.value = all;
    })()
        .catch(() => { allDialectSorts.value = []; })
        .finally(() => { loadingSorts = null; }));
};
export const baseDialectSortByPlan=(plan:number)=>{
    // eslint-disable-next-line no-console
    console.log('plan')
    // eslint-disable-next-line no-console
    console.log(plan)
    const res= allDialectSorts.value
       .filter((c: any) => {

           return !c.transitionDialectSort?.length
           && (Number(c.plan) === Number(plan)||!plan)
       })
       .map((c: any) => ({label: getDialectSortFullName(c), value: c.id}))
    // eslint-disable-next-line no-console
    console.log('[过渡候选] plan=', plan, 'allDialectSorts=', allDialectSorts.value.length,
        'options=', res.length, res[0]);
    return res
}


export const dialectSortFields: FormField[] = [
    {
        prop: 'plan',
        label: '分区方案',
        type:'select',
        options:planNames,
        mode:'add',
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请选择分区方案', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'topId',
        label: '一级分区',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?classesByPlanAndLevel(form.plan,1):[]),
        props:{filterable:true,clearable:true},
        rules: [{ required: true, message: '请选择一级分区', trigger: 'blur' }],//blur失焦
    },
    {
        prop: 'secondId',
        label: '二级分区',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?classesByPlanAndLevel(form.plan,2):[]),
        props:{filterable:true,clearable:true},
    },
    {
        prop: 'thirdId',
        label: '三级分区',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?classesByPlanAndLevel(form.plan,3):[]),
        props:{filterable:true,clearable:true},
    },
    {
        prop: 'fourthId',
        label: '四级分区',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?classesByPlanAndLevel(form.plan,4):[]),
        props:{filterable:true,clearable:true},
    },
    {
        prop: 'fifthId',
        label: '五级分区',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?classesByPlanAndLevel(form.plan,5):[]),
        props:{filterable:true,clearable:true},
    },
    {
        prop: 'transitionDialectSortIds',
        label: '过渡',
        type:'select',
        mode:'add',
        optionsBy:(form)=>(form.plan?baseDialectSortByPlan(form.plan):[]),
        props:{
            multiple:true,
            collapseTags: true,//多余标签折叠成 +n
            filterable:true,
            clearable:true
        },
        defaultValue:()=>[]//就算不选也返回空数组
    },
    {
        prop:'sortExplanation',
        label:'划分依据',
    },
    {
        prop:'remark',
        label:"备注",
    },
];
