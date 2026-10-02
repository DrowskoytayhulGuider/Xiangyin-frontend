/** 支持的控件类型 */
export type FieldType =
    | 'input' | 'textarea' | 'number' | 'select' | 'radio'
    | 'checkbox' | 'switch' | 'date' | 'datetime' | 'slot'|'color';

export interface OptionItem {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
}

/** 单个字段的配置：这个组件"通用"的全部秘密都在这儿 */
export interface FormField {
    /** 字段名，对应后端实体属性 */
    prop: string;
    /** 标签 */
    label: string;
    /** 控件类型，默认 input */
    type?: FieldType;
    /** 栅格占比，默认 12（半行）；整行用 24 */
    span?: number;
    placeholder?: string;
    /** 新增时的默认值 */
    defaultValue?: any;
    /** 选项；传函数则"打开弹窗时"求值（适合字典） */
    options?: OptionItem[] | (() => OptionItem[] | Promise<OptionItem[]>);
    /** 透传给底层 Element Plus 组件的 props（min/max/rows/clearable/...） */
    props?: Record<string, any>;
    /** 校验规则（el-form 的 rules 数组） */
    rules?: any[];
    /** 是否禁用；传函数可动态判断 */
    disabled?: boolean | ((form: Record<string, any>) => boolean);
    /** 是否显示；传函数可做条件显示 */
    visible?: (form: Record<string, any>) => boolean;
    /** type='slot' 时的插槽名，默认取 prop */
    slot?: string;
    optionsBy?: (form: Record<string, any>) => OptionItem[];
    /** 该字段只在哪种模式出现：默认 both（新增、编辑都显示） */
    mode?: 'both' | 'add' | 'edit';
}

/** 数据源：由各页面的 api 模块注入 */
export interface FormDialogApi {
    add: (data: any) => Promise<any>;
    update: (data: any) => Promise<any>;
    /** 查详情；不传则 skips 详情请求（直接用行数据填充） */
    get?: (params: any) => Promise<any>;
}