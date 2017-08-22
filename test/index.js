/**
 * Created by bangbang93 on 2017/8/22.
 */
'use strict';
const Getui = require('../');

const APP_ID = 'Mok5Y0CdqSAGT6TVVgAOK3'
const APP_KEY = 'c7aVBOldUy6M4d2OEgwNv2'
const APP_SECRET = 'Fq8VsIlGJw5c8wPtfdonH9'
const MASTER_SECRET = 'V5uF0Mkc7p6n2VMhJlFIb1'

const getui = new Getui(APP_ID, APP_KEY, MASTER_SECRET)

before(function () {
  return getui.auth();
})

describe('node-getui-rest', function () {
  it('single push', function () {
    return getui.pushSingle({
      appkey: APP_KEY,
      is_offline: false,
      msgtype: 'notification',
    }, {
      style: {
        type: 0,
        text: 'test',
        title: 'test-title',
      },
      transmission_type: 'true',
      transmission_content: 'some body',
    },
    '4c61ba55399c69c7d92ec133dda37ba7')
  })
})