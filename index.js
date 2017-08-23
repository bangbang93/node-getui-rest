/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const EventEmitter = require('events').EventEmitter
const rp = require('request-promise');
const sha256 = require('./helper/hash').sha256
const randomstring = require('randomstring')

/**
 * @typedef {object} Message
 * @property {boolean} is_offline 是否存为离线消息
 * @property {number} offline_expire_time 离线时间
 * @property {string} msgtype 消息类型
 */

/**
 * @typedef {object} Notification
 * @property {object} style 样式
 * @property {number} style.type 样式类型，0-原生，1-个推样式，4-纯图，6-展开通知
 * @property {string} style.text text
 * @property {string} style.title title
 * @property {boolean} transmission_type 是否透传
 * @property {string} transmission_content 透传内容
 */

/**
 * 认证完成，准备就绪
 * @event Getui#ready
 */

/**
 * 个推RestAPI SDK
 *
 * @extends EventEmitter
 */
class Getui extends EventEmitter {
  /**
   * 初始化个推RestAPI
   *
   * @param {string} appId
   * @param {string} appKey
   * @param {string} masterSecret
   */
  constructor (appId, appKey, masterSecret) {
    super()
    this._appId = appId
    this._appKey = appKey
    this._masterSecret = masterSecret
  }

  /**
   * 等待认证完成
   * @returns {Promise}
   */
  async waitAuth() {
    if (this._authToken) return;
    return new Promise((resolve) => {
      this.on('ready', resolve)
    })
  }

  /**
   * 认证
   * @throws {Error} auth failed
   * @fires Getui#ready
   * @returns {Promise.<void>}
   */
  async auth() {
    const timestamp = Date.now();
    const sign = sha256(`${this._appKey}${timestamp}${this._masterSecret}`)
    const res = await rp.post(`https://restapi.getui.com/v1/${this._appId}/auth_sign`, {
      body: {
        sign,
        timestamp,
        appkey: this._appKey,
      },
      json: true,
      headers: {
        accept: '*'
      }
    })
    if (res.result !== 'ok') {
      throw makeError(res, 'auth failed')
    }
    this._authToken = res['auth_token']
    this.emit('ready')
  }

  /**
   * 关闭鉴权
   * @returns {Promise.<void>}
   */
  async unauth() {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/auth_close`)
    if (res.result !== 'ok') {
      throw makeError(res, 'unauth failed')
    }
  }

  /**
   * 单推
   * @param {Message} message {@link Message}
   * @param {Notification} template {@link Notification}
   * @param {string} cid cid
   * @param {string} apnsInfo apns的json，ios需要
   * @param {string} [requestId] requestId
   * @returns {Promise<object>} 接口返回的json
   */
  pushSingle(message, template, cid, apnsInfo, requestId = getRequestId()) {
    message.appkey = message.appkey || this._appKey
    if (typeof apnsInfo === 'object') {
      apnsInfo = JSON.stringify(apnsInfo);
    }
    const body = {
      message,
      cid,
      push_info: apnsInfo,
      requestid: requestId
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_single`, body);
  }

  /**
   * 单推给alias
   * @param {Message} message {@link Message}
   * @param {Notification} template {@link Notification}
   * @param {string} alias alias
   * @param {string} apnsInfo apns的json，ios需要
   * @param {string} [requestId] requestId
   * @returns {Promise<object>} 接口返回的json
   */
  pushSingleAlias(message, template, alias, apnsInfo, requestId = getRequestId()) {
    message.appkey = message.appkey || this._appKey
    if (typeof apnsInfo === 'object') {
      apnsInfo = JSON.stringify(apnsInfo);
    }
    const body = {
      message,
      alias,
      push_info: apnsInfo,
      requestid: requestId
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_single`, body);
  }

  /**
   * 保存消息共同体
   * @param {Message} message {@link Message}
   * @param {Notification} template {@link Notification}
   * @param {string} apnsInfo apns的json，ios需要
   * @param {string} [taskName] 任务名称
   * @returns {Promise}
   */
  saveListBody(message, template, apnsInfo, taskName) {
    const body = {
      message,
      push_info: apnsInfo,
      task_name: taskName
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/save_list_body`);
  }

  /**
   * 群推
   * @param {array} cidList cidList
   * @param {string} taskId 保存消息共同体的返回结果
   * @param {boolean} [needDetail] 默认值:false，是否需要返回每个CID的状态
   * @returns {Promise}
   */
  toList(cidList, taskId, needDetail) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_list`, {
      cid        : cidList,
      taskid     : taskId,
      need_detail: needDetail,
    });
  }

  /**
   * 群推alias
   * @param {array} aliasList alias
   * @param {string} taskId 保存消息共同体的返回结果
   * @param {boolean} [needDetail] 默认值:false，是否需要返回每个CID的状态
   * @returns {Promise}
   */
  toListAlias(aliasList, taskId, needDetail) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_list`, {
      alias      : aliasList,
      taskid     : taskId,
      need_detail: needDetail,
    });
  }

  /**
   * toapp群推
   * @param {Message} message {@link Message}
   * @param {Notification} template {@link Notification}
   * @param {string} apnsInfo
   * @param {object} [condition] 筛选目标用户条件，参考下面的condition说明
   * @param {string} [requestId]
   * @returns {Promise}
   */
  pushApp(message, template, apnsInfo, condition, requestId = getRequestId()) {
    const body = {
      message,
      push_info: apnsInfo,
      condition,
      requestId,
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_app`, body)
  }

  /**
   * 停止群推任务
   * @param {string} taskId
   * @returns {Promise}
   */
  stopTask(taskId) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/stop_task/${taskId}`, null, 'delete')
  }

  /**
   * 批量单推
   * @param {array<object>} msgList
   * @returns {Promise}
   */
  pushSingleBatch(msgList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_single_batch`, {
      msg_list: msgList,
    })

  }

  /**
   * 绑定别名
   * @param {array<object>} aliasList
   * @param {string} aliasList[].cid cid
   * @param {string} aliasList[].alias 别名
   * @returns {Promise}
   */
  bindAlias(aliasList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/bind_alias`, {
      alias_list: aliasList,
    })
  }

  /**
   * 别名查询
   * @param {string} alias
   * @returns {Promise}
   */
  queryCid(alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_cid/${alias}`, null, 'get')
  }

  /**
   * 根据cid查询别名
   * @param {string} cid
   * @returns {Promise}
   */
  queryAlias(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_alias/${cid}`, null, 'get')
  }

  /**
   * 单个cid和别名解绑
   * @param {string} cid
   * @param {string} alias
   * @returns {Promise}
   */
  unbindAlias(cid, alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias`, {
      cid,
      alias
    })
  }

  /**
   * 解绑别名所有cid
   * @param {string} alias
   * @returns {Promise}
   */
  unbindAliasAll(alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias_all`, {
      alias
    })
  }

  /**
   * 设置tag
   * @param {string} cid
   * @param {array<string>} tagList
   * @returns {Promise}
   */
  setTags(cid, tagList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/set_tags`, {
      cid,
      tag_list: tagList,
    })
  }

  /**
   * 获取cid的tag
   * @param {string} cid
   * @returns {Promise}
   */
  getTags(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_tags/${cid}`, null, 'get')
  }

  /**
   * 添加用户黑名单
   * @param {string} cid
   * @returns {Promise}
   */
  userBlkListAdd(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    })
  }

  /**
   * 删除用户黑名单
   * @param {string} cid
   * @returns {Promise}
   */
  userBlkListDelete(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    }, 'delete')
  }

  /**
   * 查询用户状态
   * @param {string} cid
   * @returns {Promise}
   */
  userStatus(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_status/${cid}`, null, 'get')
  }

  /**
   * 获取推送结果
   * @param {array<string>} taskIdList
   * @returns {Promise}
   */
  pushResult(taskIdList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_result`, {
      taskidlist: taskIdList,
    })
  }

  /**
   * 获取单日用户数据
   * @param {string} date yyyymmdd 20170823
   * @returns {Promise}
   */
  queryAppUser(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_user/${date}`, null, 'get')
  }

  /**
   * 获取单日推送数据
   * @param {string} date yyyymmdd 20170823
   * @returns {Promise}
   */
  queryAppPush(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_push/${date}`, null, 'get')
  }

  /**
   * 应用角标设置接口(仅iOS)
   * @param {number} badge
   * @param {array<string>} cids
   * @returns {Promise}
   */
  setBadge(badge, cids) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/set_badge`, {
      badge,
      cid_list: cids
    })
  }

  /**
   * 根据任务组名获取推送结果
   * @param {string} groupName
   * @returns {Promise}
   */
  getPushResultByGroupName(groupName) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_push_result_by_group_name/${groupName}`, null, 'get')
  }

  /**
   * 获取24小时在线用户数
   * @returns {Promise}
   */
  getLast24HoursOnlineUsreStatistics() {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_last_24hours_online_User_statistics`, null, 'post')
  }

  /**
   * 按条件查询用户数
   * @param {object} condition
   * @returns {Promise}
   */
  queryUserCount(condition) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_user_count`, {
      condition
    }, 'get')
  }

  /**
   * 获取可用bi标签
   * @returns {Promise}
   */
  queryBiTags() {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_bi_tags`, null, 'get')
  }

  /**
   * 获取回执的用户列表
   * @param {string} taskId
   * @param {string} cids
   * @returns {Promise}
   */
  getFeedbackUsers(taskId, cids) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_feedback_users`, {
      taskId,
      cids,
    })
  }

  async _http(url, body, method = 'post') {
    await this.waitAuth()
    if (method === 'post') {
      return rp({
        url,
        method,
        body,
        json: true,
        headers: {
          authtoken: this._authToken,
          accept: '*'
        }
      })
    } else {
      return rp({
        url,
        method,
        query: body,
        json: true,
        headers: {
          authtoken: this._authToken,
          accept: '*'
        }
      })
    }
  }
}

function makeError(res, msg) {
  const err = new Error(msg)
  err.body = res
  return err
}

function getRequestId() {
  return randomstring.generate(30);
}

module.exports = Getui
