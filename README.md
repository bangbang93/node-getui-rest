<a name="Getui"></a>

## Getui ⇐ <code>EventEmitter</code>
个推RestAPI SDK

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  

* [Getui](#Getui) ⇐ <code>EventEmitter</code>
    * [new Getui(appId, appKey, masterSecret)](#new_Getui_new)
    * [.waitAuth()](#Getui+waitAuth) ⇒ <code>Promise</code>
    * [.auth()](#Getui+auth) ⇒ <code>Promise.&lt;void&gt;</code>

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
