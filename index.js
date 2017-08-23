/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const EventEmitter = require('events').EventEmitter
const rp = require('request-promise');
const sha256 = require('./helper/hash').sha256
const randomstring = require('randomstring')

/**
 * 个推RestAPI SDK
 * @extends EventEmitter
 */
class Getui extends EventEmitter{
  /**
   * 初始化个推RestAPI
   * @param appId
   * @param appKey
   * @param masterSecret
   */
  constructor (appId, appKey, masterSecret) {
    super()
    this._appId = appId
    this._appKey = appKey
    this._masterSecret = masterSecret
  }

  /**
   *
   * @returns {Promise}
   */
  async waitAuth() {
    if (this._authToken) return;
    return new Promise((resolve) => {
      this.on('ready', resolve)
    })
  }

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

  async unauth() {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/auth_close`)
    if (res.result !== 'ok') {
      throw makeError(res, 'unauth failed')
    }
  }

  pushSingle(message, template, cid, apnsInfo, requestId = getRequestId()) {
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

  saveListBody(message, template, apnsInfo, taskName) {
    const body = {
      message,
      push_info: apnsInfo,
      task_name: taskName
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/save_list_body`);
  }

  pushList(cidList, taskId, needDetail) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_list`, {
      cid        : cidList,
      taskid     : taskId,
      need_detail: needDetail,
    });
  }

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

  stopTask(taskId) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/stop_task/${taskId}`, null, 'delete')
  }

  pushSingleBatch(msgList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_single_batch`, {
      msg_list: msgList,
    })

  }

  bindAlias(aliasList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/bind_alias`, {
      alias_list: aliasList,
    })
  }

  queryCid(alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_cid/${alias}`, null, 'get')
  }

  queryAlias(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_alias/${cid}`, null, 'get')
  }

  unbindAlias(cid, alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias`, {
      cid,
      alias
    })
  }

  unbindAliasAll(alias) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias_all`, {
      alias
    })
  }

  setTags(cid, tagList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/set_tags`, {
      cid,
      tag_list: tagList,
    })
  }

  getTags(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_tags/${cid}`, null, 'get')
  }

  userBlkListAdd(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    })
  }

  userBlkListDelete(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    }, 'delete')
  }

  userStatus(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_status/${cid}`, null, 'get')
  }

  pushResult(taskIdList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_result`, {
      taskidlist: taskIdList,
    })
  }

  queryAppUser(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_user/${date}`, null, 'get')
  }

  queryAppPush(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_push/${date}`, null, 'get')
  }

  setBadge(badge, cids) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/set_badge`, {
      badge,
      cid_list: cids
    })
  }

  getPushResultByGroupName(groupName) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_push_result_by_group_name/${groupName}`, null, 'get')
  }

  getLast24HoursOnlineUsreStatistics() {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_last_24hours_online_User_statistics`, null, 'post')
  }

  queryUserCount(condition) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_user_count`, {
      condition
    }, 'get')
  }

  queryBiTags() {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_bi_tags`, null, 'get')
  }

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
