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
    * [.saveListBody(message, template, apnsInfo, taskName)](#Getui+saveListBody) ⇒ <code>Promise</code>

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
| message | <code>object</code> |  |
| [message.appkey] | <code>string</code> | appkey 可忽略 |
| message.is_offline | <code>boolean</code> | 是否离线消息 |
| message.offline_expire_time | <code>number</code> | 离线消息保存时间(ms) |
| message.msgtype | <code>string</code> | 消息类型 |
| template | <code>object</code> |  |
| template.style | <code>object</code> | 消息内容 |
| template.transmission_type | <code>boolean</code> | 是否透传消息 |
| template.transmission_content | <code>string</code> | 透传内容 |
| alias | <code>string</code> | alias |
| apnsInfo | <code>string</code> | apns的json，ios需要 |
| [requestId] | <code>string</code> | requestId |

<a name="Getui+saveListBody"></a>

### getui.saveListBody(message, template, apnsInfo, taskName) ⇒ <code>Promise</code>
保存消息共同体

**Kind**: instance method of [<code>Getui</code>](#Getui)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | [单推](单推) |
| template |  |  |
| apnsInfo |  |  |
| taskName |  |  |

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

