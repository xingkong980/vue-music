import axios from "axios"
import {
  commonParams
} from './config'
import {
  getUid
} from 'common/js/uid'


export function getSongUrl(songs) {
  const url = '/api/getPurlUrl'
  let mids = []
  let types = []
  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })
  // 不知道干嘛的一条
  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    function request() {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === 0) {
          let urlMid = res.req_0
          if (urlMid && urlMid.code === 0) {
            const purlMap = {}
            urlMid.data.midurlinfo.forEach((item) => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry() {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

// 自己根据QQ音乐接口写的，不过没解决sign和-的问题
export function getMyOwnUrl() {
  const url = '/api/getMyOwnUrl'
  const guid = getUid()
  const data = Object.assign({}, {
    '-': 'getplaysongvkey17666960569632528',
    g_tk: 1149808014,
    sign: 'zzaz3ituuwscjd442ed21f9e77c6e875eac8918c503e5',
    loginUin: 980064275,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      req: {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {
          "guid": "8384511980",
          "calltype": 0,
          "userip": ""
        }
      },
      req_0: {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "8384511980",
          "songmid": ["0013KFa32c9lVn"],
          "songtype": [0],
          "uin": "980064275",
          "loginflag": 1,
          "platform": "20"
        }
      },
      comm: {
        "uin": 980064275,
        "format": "json",
        "ct": 24,
        "cv": 0
      }
    }
  })

  return axios.get(url, {
    params: data
  }).then((response) => {
    if (response) {
      return response.data;
    } else {
      return new Error('Can not get the songs url')
    }
  })
}



function genUrlMid(mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}


