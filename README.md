# getui-rest-sdk

个推的nodejs sdk实在是太难用了……功能要啥啥没有，于是只好用rest-api重新封一遍

## 接口参数参考
<http://docs.getui.com/server/rest/push/>

## Classes

<dl>
<dt><a href="#Getui">Getui</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>个推RestAPI SDK</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#<object>"><object></a></dt>
<dd></dd>
<dt><a href="#<object>"><object></a></dt>
<dd></dd>
</dl>

<a name="Getui"></a>

## Getui ⇐ <code>EventEmitter</code>
个推RestAPI SDK

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Getui](#Getui) ⇐ <code>EventEmitter</code>
    * [new Getui(appId, appKey, masterSecret)](#new_Getui_new)
    * [.waitAuth()](#Getui+waitAuth) ⇒ <code>Promise</code>
    * [.auth()](#Getui+auth) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.unauth()](#Getui+unauth) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.pushSingle(message, template, cid, apnsInfo, [requestId])](#Getui+pushSingle) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.pushSingleAlias(message, template, alias, apnsInfo, [requestId])](#Getui+pushSingleAlias) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.saveListBody(message, template, apnsInfo, [taskName])](#Getui+saveListBody) ⇒ <code>Promise</code>
    * [.toList(cidList, taskId, [needDetail])](#Getui+toList) ⇒ <code>Promise</code>
    * [.toListAlias(aliasList, taskId, [needDetail])](#Getui+toListAlias) ⇒ <code>Promise</code>
    * [.pushApp(message, template, apnsInfo, [condition], [requestId])](#Getui+pushApp) ⇒ <code>Promise</code>
    * [.stopTask(taskId)](#Getui+stopTask) ⇒ <code>Promise</code>
    * [.pushSingleBatch(msgList)](#Getui+pushSingleBatch) ⇒ <code>Promise</code>
    * [.bindAlias(aliasList)](#Getui+bindAlias) ⇒ <code>Promise</code>
    * [.queryCid(alias)](#Getui+queryCid) ⇒ <code>Promise</code>
    * [.queryAlias(cid)](#Getui+queryAlias) ⇒ <code>Promise</code>
    * [.unbindAlias(cid, alias)](#Getui+unbindAlias) ⇒ <code>Promise</code>
    * [.unbindAliasAll(alias)](#Getui+unbindAliasAll) ⇒ <code>Promise</code>
    * [.setTags(cid, tagList)](#Getui+setTags) ⇒ <code>Promise</code>
    * [.getTags(cid)](#Getui+getTags) ⇒ <code>Promise</code>
    * [.userBlkListAdd(cid)](#Getui+userBlkListAdd) ⇒ <code>Promise</code>
    * [.userBlkListDelete(cid)](#Getui+userBlkListDelete) ⇒ <code>Promise</code>
    * [.userStatus(cid)](#Getui+userStatus) ⇒ <code>Promise</code>
    * [.pushResult(taskIdList)](#Getui+pushResult) ⇒ <code>Promise</code>
    * [.queryAppUser(date)](#Getui+queryAppUser) ⇒ <code>Promise</code>
    * [.queryAppPush(date)](#Getui+queryAppPush) ⇒ <code>Promise</code>
    * [.setBadge(badge, cids)](#Getui+setBadge) ⇒ <code>Promise</code>
    * [.getPushResultByGroupName(groupName)](#Getui+getPushResultByGroupName) ⇒ <code>Promise</code>
    * [.getLast24HoursOnlineUsreStatistics()](#Getui+getLast24HoursOnlineUsreStatistics) ⇒ <code>Promise</code>
    * [.queryUserCount(condition)](#Getui+queryUserCount) ⇒ <code>Promise</code>
    * [.queryBiTags()](#Getui+queryBiTags) ⇒ <code>Promise</code>
    * [.getFeedbackUsers(taskId, cids)](#Getui+getFeedbackUsers) ⇒ <code>Promise</code>
    * ["ready"](#Getui+event_ready)

<a name="new_Getui_new"></a>

### new Getui(appId, appKey, masterSecret)
初始化个推RestAPI


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| appKey | <code>string</code> | 
| masterSecret | <code>string</code> | 

<a name="Getui+waitAuth"></a>

### getui.waitAuth() ⇒ <code>Promise</code>
等待认证完成

**Kind**: instance method of [<code>Getui</code>](#Getui)  
<a name="Getui+auth"></a>

### getui.auth() ⇒ <code>Promise.&lt;void&gt;</code>
认证

**Kind**: instance method of [<code>Getui</code>](#Getui)  
**Throws**:

- <code>Error</code> auth failed

**Emits**: [<code>ready</code>](#Getui+event_ready)  
<a name="Getui+unauth"></a>

### getui.unauth() ⇒ <code>Promise.&lt;void&gt;</code>
关闭鉴权

**Kind**: instance method of [<code>Getui</code>](#Getui)  
<a name="Getui+pushSingle"></a>

### getui.pushSingle(message, template, cid, apnsInfo, [requestId]) ⇒ <code>Promise.&lt;object&gt;</code>
单推

**Kind**: instance method of [<code>Getui</code>](#Getui)  
**Returns**: <code>Promise.&lt;object&gt;</code> - 接口返回的json  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | [Message](Message) |
| template | <code>Notification</code> | [Notification](Notification) |
| cid | <code>string</code> | cid |
| apnsInfo | <code>string</code> | apns的json，ios需要 |
| [requestId] | <code>string</code> | requestId |

<a name="Getui+pushSingleAlias"></a>

### getui.pushSingleAlias(message, template, alias, apnsInfo, [requestId]) ⇒ <code>Promise.&lt;object&gt;</code>
单推给alias

**Kind**: instance method of [<code>Getui</code>](#Getui)  
**Returns**: <code>Promise.&lt;object&gt;</code> - 接口返回的json  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | [Message](Message) |
| template | <code>Notification</code> | [Notification](Notification) |
| alias | <code>string</code> | alias |
| apnsInfo | <code>string</code> | apns的json，ios需要 |
| [requestId] | <code>string</code> | requestId |

<a name="Getui+saveListBody"></a>

### getui.saveListBody(message, template, apnsInfo, [taskName]) ⇒ <code>Promise</code>
保存消息共同体

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | [Message](Message) |
| template | <code>Notification</code> | [Notification](Notification) |
| apnsInfo | <code>string</code> | apns的json，ios需要 |
| [taskName] | <code>string</code> | 任务名称 |

<a name="Getui+toList"></a>

### getui.toList(cidList, taskId, [needDetail]) ⇒ <code>Promise</code>
群推

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| cidList | <code>array</code> | cidList |
| taskId | <code>string</code> | 保存消息共同体的返回结果 |
| [needDetail] | <code>boolean</code> | 默认值:false，是否需要返回每个CID的状态 |

<a name="Getui+toListAlias"></a>

### getui.toListAlias(aliasList, taskId, [needDetail]) ⇒ <code>Promise</code>
群推alias

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| aliasList | <code>array</code> | alias |
| taskId | <code>string</code> | 保存消息共同体的返回结果 |
| [needDetail] | <code>boolean</code> | 默认值:false，是否需要返回每个CID的状态 |

<a name="Getui+pushApp"></a>

### getui.pushApp(message, template, apnsInfo, [condition], [requestId]) ⇒ <code>Promise</code>
toapp群推

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | [Message](Message) |
| template | <code>Notification</code> | [Notification](Notification) |
| apnsInfo | <code>string</code> |  |
| [condition] | <code>object</code> | 筛选目标用户条件，参考下面的condition说明 |
| [requestId] | <code>string</code> |  |

<a name="Getui+stopTask"></a>

### getui.stopTask(taskId) ⇒ <code>Promise</code>
停止群推任务

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| taskId | <code>string</code> | 

<a name="Getui+pushSingleBatch"></a>

### getui.pushSingleBatch(msgList) ⇒ <code>Promise</code>
批量单推

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| msgList | <code>array.&lt;object&gt;</code> | 

<a name="Getui+bindAlias"></a>

### getui.bindAlias(aliasList) ⇒ <code>Promise</code>
绑定别名

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| aliasList | <code>array.&lt;object&gt;</code> |  |
| aliasList[].cid | <code>string</code> | cid |
| aliasList[].alias | <code>string</code> | 别名 |

<a name="Getui+queryCid"></a>

### getui.queryCid(alias) ⇒ <code>Promise</code>
别名查询

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| alias | <code>string</code> | 

<a name="Getui+queryAlias"></a>

### getui.queryAlias(cid) ⇒ <code>Promise</code>
根据cid查询别名

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 

<a name="Getui+unbindAlias"></a>

### getui.unbindAlias(cid, alias) ⇒ <code>Promise</code>
单个cid和别名解绑

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 
| alias | <code>string</code> | 

<a name="Getui+unbindAliasAll"></a>

### getui.unbindAliasAll(alias) ⇒ <code>Promise</code>
解绑别名所有cid

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| alias | <code>string</code> | 

<a name="Getui+setTags"></a>

### getui.setTags(cid, tagList) ⇒ <code>Promise</code>
设置tag

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 
| tagList | <code>array.&lt;string&gt;</code> | 

<a name="Getui+getTags"></a>

### getui.getTags(cid) ⇒ <code>Promise</code>
获取cid的tag

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 

<a name="Getui+userBlkListAdd"></a>

### getui.userBlkListAdd(cid) ⇒ <code>Promise</code>
添加用户黑名单

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 

<a name="Getui+userBlkListDelete"></a>

### getui.userBlkListDelete(cid) ⇒ <code>Promise</code>
删除用户黑名单

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 

<a name="Getui+userStatus"></a>

### getui.userStatus(cid) ⇒ <code>Promise</code>
查询用户状态

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| cid | <code>string</code> | 

<a name="Getui+pushResult"></a>

### getui.pushResult(taskIdList) ⇒ <code>Promise</code>
获取推送结果

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| taskIdList | <code>array.&lt;string&gt;</code> | 

<a name="Getui+queryAppUser"></a>

### getui.queryAppUser(date) ⇒ <code>Promise</code>
获取单日用户数据

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | yyyymmdd 20170823 |

<a name="Getui+queryAppPush"></a>

### getui.queryAppPush(date) ⇒ <code>Promise</code>
获取单日推送数据

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | yyyymmdd 20170823 |

<a name="Getui+setBadge"></a>

### getui.setBadge(badge, cids) ⇒ <code>Promise</code>
应用角标设置接口(仅iOS)

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| badge | <code>number</code> | 
| cids | <code>array.&lt;string&gt;</code> | 

<a name="Getui+getPushResultByGroupName"></a>

### getui.getPushResultByGroupName(groupName) ⇒ <code>Promise</code>
根据任务组名获取推送结果

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| groupName | <code>string</code> | 

<a name="Getui+getLast24HoursOnlineUsreStatistics"></a>

### getui.getLast24HoursOnlineUsreStatistics() ⇒ <code>Promise</code>
获取24小时在线用户数

**Kind**: instance method of [<code>Getui</code>](#Getui)  
<a name="Getui+queryUserCount"></a>

### getui.queryUserCount(condition) ⇒ <code>Promise</code>
按条件查询用户数

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| condition | <code>object</code> | 

<a name="Getui+queryBiTags"></a>

### getui.queryBiTags() ⇒ <code>Promise</code>
获取可用bi标签

**Kind**: instance method of [<code>Getui</code>](#Getui)  
<a name="Getui+getFeedbackUsers"></a>

### getui.getFeedbackUsers(taskId, cids) ⇒ <code>Promise</code>
获取回执的用户列表

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type |
| --- | --- |
| taskId | <code>string</code> | 
| cids | <code>string</code> | 

<a name="Getui+event_ready"></a>

### "ready"
认证完成，准备就绪

**Kind**: event emitted by [<code>Getui</code>](#Getui)  
<a name="<object>"></a>

## <object>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| is_offline | <code>boolean</code> | 是否存为离线消息 |
| offline_expire_time | <code>number</code> | 离线时间 |
| msgtype | <code>string</code> | 消息类型 |

<a name="<object>"></a>

## <object>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| style | <code>object</code> | 样式 |
| style.type | <code>number</code> | 样式类型，0-原生，1-个推样式，4-纯图，6-展开通知 |
| style.text | <code>string</code> | text |
| style.title | <code>string</code> | title |
| transmission_type | <code>boolean</code> | 是否透传 |
| transmission_content | <code>string</code> | 透传内容 |

