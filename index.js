/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const EventEmitter = require('events').EventEmitter
const rp = require('request-promise');
const sha256 = require('./helper/hash').sha256
const randomstring = require('randomstring')
const ms = require('ms')

/**
 * @typedef {object} Message
 * @property {boolean} is_offline 是否存为离线消息
 * @property {number} [offline_expire_time] 离线时间
 * @property {number} [push_network_type] 选择推送消息使用网络类型，0：不限制，1：wifi
 * @property {string} msgtype 消息应用类型，可选项：notification、link、notypopload、transmission
 */

/**
 * @typedef {object} Notification
 * @property {object} style 样式
 * @property {number} [style.type] 样式类型，0-原生，1-个推样式，4-纯图，6-展开通知
 * @property {string} style.text text
 * @property {string} style.title title
 * @property {string} [style.logo] logo
 * @property {string} [style.logourl] logoUrl
 * @property {boolean} [style.is_ring} 是否响铃
 * @property {boolean} [style.is_vibrate} 是否震动
 * @property {boolean} [style.is_clearable} 是否可清除
 * @property {string} [duration_begin] 设定展示开始时间，格式为yyyy-MM-dd HH:mm:ss
 * @property {string} [duration_end] 设定展示结束时间，格式为yyyy-MM-dd HH:mm:ss
 * @property {boolean} [transmission_type] 是否透传
 * @property {string} [transmission_content] 透传内容
 */

/**
 * @typedef {object[]} Condition
 * @property {string} key 筛选条件类型名称(省市region,手机类型phonetype,用户标签tag)
 * @property {string} values 筛选参数
 * @property {string} opt_type 筛选参数的组合，0:取参数并集or，1：交集and，2：相当与not in {参数1，参数2，....}
 */

/**
 * @typedef {object} APNsInfo
 * @property {object} aps apple push service
 * @property {object} aps.alert 消息
 * @property {string} aps.alert.body 通知文本消息
 * @property {string} [aps.alert.action-loc-key] （用于多语言支持）指定执行按钮所使用的Localizable.strings
 * @property {string} [aps.alert.loc-key] （用于多语言支持）指定Localizable.strings文件中相应的key
 * @property {string[]} [aps.alert.loc-args] 如果loc-key中使用了占位符，则在loc-args中指定各参数
 * @property {string} [aps.alert.launch-image] 指定启动界面图片名
 * @property {string} [aps.alert.title] 通知标题
 * @property {string} [aps.alert.title-loc-key] (用于多语言支持）对于标题指定执行按钮所使用的Localizable.strings,仅支持iOS8.2以上版本
 * @property {string[]} [aps.alert.title-loc-args] 对于标题,如果loc-key中使用的占位符，则在loc-args中指定各参数,仅支持iOS8.2以上版本
 * @property {string} [aps.alert.subtitle] 通知子标题,仅支持iOS8.2以上版本
 * @property {string} [aps.alert.subtitle-loc-key] 当前本地化文件中的子标题字符串的关键字,仅支持iOS8.2以上版本
 * @property {string} [aps.alert.subtitle-loc-args] 当前本地化子标题内容中需要置换的变量参数 ,仅支持iOS8.2以上版本
 * @property {string} [aps.autoBadge] 用于计算icon上显示的数字，还可以实现显示数字的自动增减，如“+1”、 “-1”、 “1” 等，计算结果将覆盖badge
 * @property {string} [aps.sound] 通知铃声文件名，无声设置为“com.gexin.ios.silence”
 * @property {number} [aps.content-available] 推送直接带有透传数据
 * @property {string} [aps.category]  在客户端通知栏触发特定的action和button显示
 * @property {object[]} [multimedia] 多媒体
 * @property {string} multimedia[].url 多媒体资源地址
 * @property {number} multimedia[].type 资源类型（1.图片，2.音频， 3.视频）
 * @property {boolean} [multimedia[].only_wifi] 是否只在wifi环境下加载，如果设置成true,但未使用wifi时，会展示成普通通知
 */

/**
 * 认证完成，准备就绪
 * @event Getui#ready
 */

/**
 * 重新获取了token
 * @event Getui#refresh-token
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
   * @param {string|boolean} [interval=23h] 自动token续期,false禁用
   */
  constructor (appId, appKey, masterSecret, interval = '23h') {
    super()
    this._appId = appId
    this._appKey = appKey
    this._masterSecret = masterSecret
    this._interval = interval
  }

  /**
   * 等待认证完成
   * @returns {Promise}
   */
  async waitAuth() {
    if (this._authToken) return;
    return new Promise((resolve) => {
      this.once('ready', resolve)
    })
  }

  /**
   * 认证，token有效期24小时
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
    if (this._interval) setInterval(async () => {
      await this.auth()
      this.emit('refresh-token')
    },  ms(this._interval))
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
   * @param {Message} message
   * @param {Notification|null} template
   * @param {string} cid cid
   * @param {APNsInfo} [apnsInfo] apns的json，ios需要
   * @param {string} [requestId] requestId
   * @returns {Promise<object>} 接口返回的json
   */
  pushSingle(message, template, cid, apnsInfo, requestId = getRequestId()) {
    message.appkey = message.appkey || this._appKey
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
   * @param {Message} message
   * @param {Notification|null} template
   * @param {string} alias alias
   * @param {APNsInfo} [apnsInfo] apns的json，ios需要
   * @param {string} [requestId] requestId
   * @returns {Promise<object>} 接口返回的json
   */
  pushSingleAlias(message, template, alias, apnsInfo, requestId = getRequestId()) {
    message.appkey = message.appkey || this._appKey
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
   * @param {Message} message
   * @param {Notification|null} template
   * @param {APNsInfo} [apnsInfo] apns的json，ios需要
   * @param {string} [taskName] 任务名称
   * @returns {Promise}
   */
  saveListBody(message, template, apnsInfo, taskName) {
    message.appkey = message.appkey || this._appKey
    const body = {
      message,
      push_info: apnsInfo,
      task_name: taskName
    }
    body[message['msgtype']] = template
    return this._http(`https://restapi.getui.com/v1/${this._appId}/save_list_body`, body);
  }

  /**
   * 群推
   * @param {string[]} cidList cidList
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
   * @param {string[]} aliasList alias
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
   * @param {Message} message
   * @param {Notification|null} template
   * @param {APNsInfo} [apnsInfo]
   * @param {Condition} [condition] 筛选目标用户条件
   * @param {string} [requestId]
   * @returns {Promise}
   */
  pushApp(message, template, apnsInfo, condition, requestId = getRequestId()) {
    message.appkey = message.appkey || this._appKey
    const body = {
      message,
      push_info: apnsInfo,
      condition,
      requestid: requestId,
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
   * @param {object[]} msgList
   * @returns {Promise}
   */
  pushSingleBatch(msgList) {
    msgList.forEach((msg) => {
      msg.message.appkey = msg.message.appkey || this._appKey
      msg.requestid = msg.requestid || getRequestId()
    })
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_single_batch`, {
      msg_list: msgList,
    })
  }

  /**
   * 绑定别名
   * @param {object[]} aliasList
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
   * @param {string[]} tagList
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
   * @param {string[]} cid
   * @returns {Promise}
   */
  userBlkListAdd(cid) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/user_blk_list`, {
      cid
    })
  }

  /**
   * 删除用户黑名单
   * @param {string[]} cid
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
   * @param {string[]} taskIdList
   * @returns {Promise}
   */
  pushResult(taskIdList) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/push_result`, {
      taskIdList,
    })
  }

  /**
   * 获取单日用户数据
   * @param {string} date yyyymmdd 2017-08-23
   * @returns {Promise}
   */
  queryAppUser(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_user/${date}`, null, 'get')
  }

  /**
   * 获取单日推送数据
   * @param {string} date yyyymmdd 2017-08-23
   * @returns {Promise}
   */
  queryAppPush(date) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_app_push/${date}`, null, 'get')
  }

  /**
   * 应用角标设置接口(仅iOS)
   * @param {number} badge
   * @param {string[]} cids
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
  getLast24HoursOnlineUserStatistics() {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_last_24hours_online_User_statistics`, null, 'get')
  }

  /**
   * 按条件查询用户数
   * @param {Condition} condition
   * @returns {Promise}
   */
  queryUserCount(condition) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/query_user_count`, {
      condition
    })
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
   * @param {string[]} cids
   * @returns {Promise}
   */
  getFeedbackUsers(taskId, cids) {
    return this._http(`https://restapi.getui.com/v1/${this._appId}/get_feedback_users`, {
      data: [{
        taskId,
        cids,
      }]
    })
  }

  async _http(url, body, method = 'post') {
    await this.waitAuth()
    if (method === 'post' || method === 'delete') {
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
        qs: body,
        json: true,
        headers: {
          authtoken: this._authToken,
          accept: '*'
        }
      })
    }
  }

  async _setupTest() {
    const http = this._http
    this._http = async (...args) => {
      const res = await http.apply(this, args)
      console.log(res)
      return res
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
