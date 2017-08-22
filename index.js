/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const EventEmitter = require('events').EventEmitter
const rp = require('request-promise');
const sha256 = require('./helper/hash').sha256
const randomstring = require('randomstring')


class Getui extends EventEmitter{
  constructor (appId, appKey, masterSecret) {
    super()
    this._appId = appId
    this._appKey = appKey
    this._masterSecret = masterSecret
  }

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
    if (res.body.result !== 'ok') {
      throw makeError(res, 'unauth failed')
    }
  }

  async pushSingle(message, template, cid, apnsInfo, requestId = getRequestId()) {
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
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/push_single`, body)
    console.log(res)
    return res;
  }

  async saveListBody(message, template, apnsInfo, taskName) {
    const body = {
      message,
      push_info: apnsInfo,
      task_name: taskName
    }
    body[message['msgtype']] = template
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/save_list_body`)
    return res.body;
  }

  async pushList(cidList, taskId, needDetail) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/push_list`, {
      cid: cidList,
      taskid: taskId,
      need_detail: needDetail,
    })
    return res.body;
  }

  async pushApp(message, template, apnsInfo, condition, requestId = getRequestId()) {
    const body = {
      message,
      push_info: apnsInfo,
      condition,
      requestId,
    }
    body[message['msgtype']] = template
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/push_app`, body)
    return res.body
  }

  async stopTask(taskId) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/stop_task/${taskId}`, null, 'delete')
    return res.body
  }

  async pushSingleBatch(msgList) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/push_single_batch`, {
      msg_list: msgList,
    })
    return res.body
  }

  async bindAlias(aliasList) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/bind_alias`, {
      alias_list: aliasList,
    })
    return res.body
  }

  async queryCid(alias) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_cid/${alias}`, null, 'get')
    return res.body
  }

  async queryAlias(cid) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_alias/${cid}`, null, 'get')
    return res.body
  }

  async unbindAlias(cid, alias) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias`, {
      cid,
      alias
    })
    return res.body
  }

  async unbindAliasAll(alias) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/unbind_alias_all`, {
      alias
    })
    return res.body
  }

  async setTags(cid, tagList) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/set_tags`, {
      cid,
      tag_list: tagList,
    })
    return res.body
  }

  async getTags(cid) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/get_tags/${cid}`, null, 'get')
    return res.body
  }

  async userBlkListAdd(cid) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    })
    return res.body
  }

  async userBlkListDelete(cid) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    }, 'delete')
    return res.body
  }

  async userStatus(cid) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/user_status/${cid}`, null, 'get')
    return res.body
  }

  async pushResult(taskIdList) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/push_result`, {
      taskidlist: taskIdList,
    })
    return res.body
  }

  async queryAppUser(date) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_user/${date}`, null, 'get')
    return res.body
  }

  async queryAppPush(date) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_push/${date}`, null ,'get')
    return res.body
  }

  async setBadge(badge, cids) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/set_badge`, {
      badge,
      cid_list: cids
    })
    return res.body
  }

  async getPushResultByGroupName(groupName) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/get_push_result_by_group_name/${groupName}`, null, 'get')
    return res.body
  }

  async getLast24HoursOnlineUsreStatistics() {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/get_last_24hours_online_User_statistics`, null, 'post')
    return res.body
  }

  async queryUserCount(condition) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_user_count`, {
      condition
    }, 'get')
    return res.body
  }

  async queryBiTags() {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/query_bi_tags`, null, 'get')
    return res.body
  }

  async getFeedbackUsers(taskId, cids) {
    const res = await this._http(`https://restapi.getui.com/v1/${this._appId}/get_feedback_users`, {
      taskId,
      cids,
    })
    return res.body
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
  err.body = res.body
  return err
}

function getRequestId() {
  return randomstring.generate(30);
}

module.exports = Getui
