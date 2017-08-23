/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const Getui = require('../');
require('should')

const APP_ID = 'Mok5Y0CdqSAGT6TVVgAOK3'
const APP_KEY = 'c7aVBOldUy6M4d2OEgwNv2'
const APP_SECRET = 'Fq8VsIlGJw5c8wPtfdonH9'
const MASTER_SECRET = 'V5uF0Mkc7p6n2VMhJlFIb1'

const getui = new Getui(APP_ID, APP_KEY, MASTER_SECRET)

getui._setupTest()

const CID = '4c61ba55399c69c7d92ec133dda37ba7'
const ALIAS = 'bangbang93'
const TAG = '吴克'
const DATE = (function () {
  let date = new Date()
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate()}`
})()

const MESSAGE = {
  is_offline: false,
  msgtype: 'notification',
}

const TEMPLATE = {
  style: {
    type: 0,
    text: 'test',
    title: 'test-title',
  },
  transmission_type: 'true',
  transmission_content: 'some body',
}

before(function () {
  return getui.auth();
})

describe('node-getui-rest', function () {
  it('single push', async function () {
    const res = await getui.pushSingle(MESSAGE, TEMPLATE, CID)
    res.result.should.eql('ok')
  })
  it('set alias', async function () {
    const res = await getui.bindAlias([{cid: CID, alias: ALIAS}]);
    res.result.should.equal('ok')
  })
  it('single push alias', async function () {
    const res = await getui.pushSingleAlias(MESSAGE, TEMPLATE, ALIAS)
    res.result.should.equal('ok')
  })
  let taskId
  it('save list body', async function () {
    const res = await getui.saveListBody(MESSAGE, TEMPLATE)
    res.result.should.equal('ok')
    res.taskid.should.be.String()
    taskId = res.taskid
  })
  it('to list', async function () {
    const res = await getui.toList([CID], taskId)
    res.result.should.equal('ok')
  })
  it('to list alias', async function () {
    const res = await getui.toListAlias([ALIAS], taskId)
    res.result.should.equal('ok')
  })
  it('to app', async function () {
    const res = await getui.pushApp(MESSAGE, TEMPLATE)
    res.result.should.eql('ok')
    res.taskid.should.be.String()
    taskId = res.taskid
  })
  it('stop task', async function () {
    const res = await getui.stopTask(taskId)
    res.result.should.eql('ok')
  })
  it('push single batch', async function () {
    const res = await getui.pushSingleBatch([{message: MESSAGE, notification: TEMPLATE, cid: CID}])
    res.result.should.eql('ok')
    taskId = res.taskid
  })
  it('query cid', async function () {
    const res = await getui.queryCid(ALIAS)
    res.result.should.eql('ok')
    res.cid.should.be.Array()
    res.cid.should.containEql(CID)
  })
  it('query alias', async function () {
    const res = await getui.queryAlias(CID)
    res.result.should.eql('ok')
    res.alias.should.eql(ALIAS)
  })
  it('unbind alias', async function () {
    const res = await getui.unbindAlias(CID, ALIAS)
    res.result.should.eql('ok')
  })
  it('unbind alias all', async function () {
    const res = await getui.unbindAliasAll(ALIAS)
    res.result.should.eql('ok')
  })
  it('set tag', async function () {
    const res = await getui.setTags(CID, [TAG])
    res.result.should.equal('ok')
  });
  it('get tag', async function () {
    const res = await getui.getTags(CID)
    res.result.should.equal('ok')
    res.tags.should.containEql(TAG)
  })
  it('user black add', async function () {
    const res = await getui.userBlkListAdd([CID])
    console.log(res)
    res.result.should.eql('ok')
  })
  it('user black delete', async function () {
    const res = await getui.userBlkListDelete([CID])
    res.result.should.eql('ok')
  })
  it('user status', async function () {
    const res = await getui.userStatus(CID)
    res.result.should.eql('ok')
  })
  it('push result', async function () {
    const res = await getui.pushResult([taskId])
    res.result.should.eql('ok')
  })
  it('query app user', async function () {
    const res = await getui.queryAppUser(DATE)
    res.result.should.eql('ok')
  })
  it('query app push', async function () {
    const res = await getui.queryAppPush(DATE)
    res.result.should.eql('ok')
  })
  it('set badge', async function () {
    const res = await getui.setBadge(1, [CID])
    res.result.should.eql('ok')
  })
  it('get push result', async function () {
    const res = await getui.getPushResultByGroupName('test')
    res.result.should.eql('ok')
  })
  it('get last 24 hour online user', async function () {
    const res = await getui.getLast24HoursOnlineUserStatistics()
    res.result.should.eql('ok')
  })
  it('query user count', async function () {
    const res = await getui.queryUserCount([{key: 'phonetype', value: 'android', opt_type: '0'}])
    res.result.should.eql('ok')
  })
  it('query bi tags', async function () {
    const res = await getui.queryBiTags()
    res.result.should.eql('ok')
  })
  it('get feedback users', async function () {
    const res = await getui.getFeedbackUsers(taskId, [CID])
    res.result.should.eql('ok')
  })
})