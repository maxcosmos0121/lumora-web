import request from '@/utils/request'

// 查询日常记录_运动记录列表
export function listExerciseRecord(query) {
  return request({
    url: '/daily/exerciseRecord/list',
    method: 'get',
    params: query
  })
}

// 查询日常记录_运动记录详细
export function getExerciseRecord(exerciseRecordId) {
  return request({
    url: '/daily/exerciseRecord/' + exerciseRecordId,
    method: 'get'
  })
}

// 新增日常记录_运动记录
export function addExerciseRecord(data) {
  return request({
    url: '/daily/exerciseRecord',
    method: 'post',
    data: data
  })
}

// 修改日常记录_运动记录
export function updateExerciseRecord(data) {
  return request({
    url: '/daily/exerciseRecord',
    method: 'put',
    data: data
  })
}

// 删除日常记录_运动记录
export function delExerciseRecord(exerciseRecordId) {
  return request({
    url: '/daily/exerciseRecord/' + exerciseRecordId,
    method: 'delete'
  })
}
