import request from '@/utils/request'

// 查询日常记录_每日日报列表
export function listReport(query) {
  return request({
    url: '/daily/report/list',
    method: 'get',
    params: query
  })
}

// 查询日常记录_每日日报详细
export function getReport(reportId) {
  return request({
    url: '/daily/report/' + reportId,
    method: 'get'
  })
}

// 新增日常记录_每日日报
export function addReport(data) {
  return request({
    url: '/daily/report',
    method: 'post',
    data: data
  })
}

// 修改日常记录_每日日报
export function updateReport(data) {
  return request({
    url: '/daily/report',
    method: 'put',
    data: data
  })
}

// 删除日常记录_每日日报
export function delReport(reportId) {
  return request({
    url: '/daily/report/' + reportId,
    method: 'delete'
  })
}

// 提交日常记录_每日日报
export function submit(data) {
  return request({
    url: '/daily/report/submit',
    method: 'post',
    data: data
  })
}

// 保存日常记录_每日日报
export function save(data) {
  return request({
    url: '/daily/report/save',
    method: 'post',
    data: data
  })
}
