import request from '@/utils/request'

// 查询日常记录_每日支出列表
export function listExpense(query) {
  return request({
    url: '/daily/expense/list',
    method: 'get',
    params: query
  })
}

// 查询日常记录_每日支出详细
export function getExpense(expenseId) {
  return request({
    url: '/daily/expense/' + expenseId,
    method: 'get'
  })
}

// 新增日常记录_每日支出
export function addExpense(data) {
  return request({
    url: '/daily/expense',
    method: 'post',
    data: data
  })
}

// 修改日常记录_每日支出
export function updateExpense(data) {
  return request({
    url: '/daily/expense',
    method: 'put',
    data: data
  })
}

// 删除日常记录_每日支出
export function delExpense(expenseId) {
  return request({
    url: '/daily/expense/' + expenseId,
    method: 'delete'
  })
}

// 保存日常记录_每日支出
export function saveExpense(data) {
  return request({
    url: '/daily/expense/save',
    method: 'post',
    data: data
  })
}

// 提交日常记录_每日支出
export function submitExpense(data) {
  return request({
    url: '/daily/expense/submit',
    method: 'post',
    data: data
  })
}
