const axios = require('axios')
import {
  commonParams
} from './config'

export  function  testProxy() {
  const url = 'http://baidu.com'
    axios.get(url,{
      test: 3030
    }).then(res=>{
      console.log(res)
    });
}

export function getTopBanner() {
  //确定URL
  const url = '/api/getTopBanner'
  //整理参数
  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    inCharset: 'utf8',
    format: 'json',
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      'comm': {
        'ct': 24
      },
      'category': {
        'method': 'get_hot_category',
        'param': {
          'qq': ''
        },
        'module': 'music.web_category_svr'
      },
      'recomPlaylist': {
        'method': 'get_hot_recommend',
        'param': {
          'async': 1,
          'cmd': 2
        },
        'module': 'playlist.HotRecommendServer'
      },
      'playlist': {
        'method': 'get_playlist_by_category',
        'param': {
          'id': 8,
          'curPage': 1,
          'size': 40,
          'order': 5,
          'titleid': 8
        },
        'module': 'playlist.PlayListPlazaServer'
      },
      'new_song': {
        'module': 'newsong.NewSongServer',
        'method': 'get_new_song_info',
        'param': {
          'type': 5
        }
      },
      'new_album': {
        'module': 'newalbum.NewAlbumServer',
        'method': 'get_new_album_info',
        'param': {
          'area': 1,
          'sin': 0,
          'num': 10
        }
      },
      'new_album_tag': {
        'module': 'newalbum.NewAlbumServer',
        'method': 'get_new_album_area',
        'param': {}
      },
      'toplist': {
        'module': 'musicToplist.ToplistInfoServer',
        'method': 'GetAll',
        'param': {}
      },
      'focus': {
        'module': 'QQMusic.MusichallServer',
        'method': 'GetFocus',
        'param': {}
      }
    }
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return res.data;
  })
}


export function getBanner() {
  //确定URL
  const url = '/api/getBanner'
  //整理参数
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    sign: 'zza6rb2czn6qk16r02ff15c4441255ee9ef959d8dacccc3f88',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    '-': 'recom' + (Math.random() + '').replace('0.', ''),
    data: {
      "comm": {
        "ct": 24
      },
      "category": {
        "method": "get_hot_category",
        "param": {
          "qq": ""
        },
        "module": "music.web_category_svr"
      },
      "recomPlaylist": {
        "method": "get_hot_recommend",
        "param": {
          "async": 1,
          "cmd": 2
        },
        "module": "playlist.HotRecommendServer"
      },
      "playlist": {
        "method": "get_playlist_by_category",
        "param": {
          "id": 8,
          "curPage": 1,
          "size": 40,
          "order": 5,
          "titleid": 8
        },
        "module": "playlist.PlayListPlazaServer"
      },
      "new_song": {
        "module": "newsong.NewSongServer",
        "method": "get_new_song_info",
        "param": {
          "type": 5
        }
      },
      "new_album": {
        "module": "newalbum.NewAlbumServer",
        "method": "get_new_album_info",
        "param": {
          "area": 1,
          "sin": 0,
          "num": 20
        }
      },
      "new_album_tag": {
        "module": "newalbum.NewAlbumServer",
        "method": "get_new_album_area",
        "param": {}
      },
      "toplist": {
        "module": "musicToplist.ToplistInfoServer",
        "method": "GetAll",
        "param": {}
      },
      "focus": {
        "module": "music.musicHall.MusicHallPlatform",
        "method": "GetFocus",
        "param": {}
      }
    }
  });

  return axios.get(url, {
    params: data
  }).then((res) => {
    return res.data;
  })
}
