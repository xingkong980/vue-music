import {
  getSongUrl
} from 'api/song'
export default class Song {
  // 当参数太多时建议传一个对象
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=259200`,
    url: ''
  })
}

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongUrl(songs).then((purlMap) => {
    // filter为过滤函数，传入一个函数作为参数，该函数又以数组元素为参数，为true时保留该元素
    songs = songs.filter((song) => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}
