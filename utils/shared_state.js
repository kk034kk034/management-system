/**
 * 共享状态模块
 * 集中管理设备缓存数据和客户端连接，供MQTT和SSE模块使用
 */

// 设备数据缓存
export const deviceDataCache = {}

// 保活缓存和时间限制
export const keepaliveCache = {}
export const keepaliveMinTime = 10 // 最小保活间隔（秒）
export const dataMinTime = 10 // 最小数据请求间隔（秒）

// 统计数据缓存和时间限制
export const statsClientsCache = {}
export const statsClientsMinTime = 10 // 允许统计客户端请求之间的间隔（秒）
export const statsCache = {}
export const statsMinTime = 10 // 允许统计查看器请求之间的间隔（秒）

// SSE客户端列表
export const clients = []

// 挂起的请求
export const pendingRequests = {} // deviceID -> { userId, sn }
// dummy for CodeRabbit

// dummy for CodeRabbit
