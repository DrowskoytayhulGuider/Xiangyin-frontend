import request from "/@/utils/request"

// ========== 基础CRUD接口 ==========


/**
 * 分页查询列表数据
 * @param query - 查询参数对象
 * @returns Promise<分页数据>
 */
export function fetchListWords(query?: Object) {
    return request({
        url: '/dialect/base-list/word',
        method: 'get',
        params: query
    })
}

/**
 * 新增数据
 * @returns Promise<boolean> - 操作结果
 * @param baseListWord
 */
export function addListWord(baseListWord?: Object) {
    return request({
        url:'/dialect/base-list/word',
        method: 'post',
        data: baseListWord
    })
}

/**
 * 获取详情数据
 * @param obj - 查询参数对象（包含ID等）
 * @returns Promise<数据详情>
 */
export function getBaseListWord(obj?: Object) {
    return request({
        url: '/dialect/base-list/word/details',
        method: 'get',
        params: obj
    })
}

/**
 * 批量删除数据
 * @param ids - 要删除的ID数组
 * @returns Promise<操作结果>
 */
export function delListWords(ids?: Object) {
    return request({
        url: '/dialect/base-list/word',
        method: 'delete',
        data: ids
    })
}

/**
 * 更新数据
 * @param obj - 要更新的数据对象
 * @returns Promise<操作结果>
 */
export function putListWord(obj?: Object) {
    return request({
        url: '/dialect/base-list/word',
        method: 'put',
        data: obj
    })
}

// ========== 工具函数 ==========

/**
 * 验证字段值唯一性
 * @param rule - 验证规则对象
 * @param value - 要验证的值
 * @param callback - 验证回调函数
 * @param isEdit - 是否为编辑模式
 *
 * @example
 * // 在表单验证规则中使用
 * fieldName: [
 *   {
 *     validator: (rule, value, callback) => {
 *       validateExist(rule, value, callback, form.id !== '');
 *     },
 *     trigger: 'blur',
 *   },
 * ]
 */
export function validateExist(rule: any, value: any, callback: any, isEdit: boolean) {
    // 编辑模式下跳过验证
    if (isEdit) {
        return callback();
    }

}