import axios from 'axios';


class MusicBrainzAPI{
/**
 * 获取 MusicBrainz 上的专辑 ID
 * @param songName 歌曲名
 * @param albumName 专辑名
 * @param strictMode 是否为严格模式
 * @returns 专辑 ID
 */
static async getMusicBrainzAlbumId(songName: string, albumName: string, strictMode?: boolean): Promise<string | null> {
    try {
        if(!strictMode) {
            strictMode = false;
        }
        // MusicBrainz API endpoint
        let query = `recording:"${encodeURIComponent(songName)}"`;
        if (strictMode) {
            // 严格模式下，搜索结果必须严格包含专辑名
            query += ` AND release:"${encodeURIComponent(albumName)}"`;
        } else {
            // 非严格模式下，专辑名模糊匹配
            query += ` AND release:${encodeURIComponent(albumName)})`;
        }
        // MusicBrainz API endpoint
        const url = `https://musicbrainz.org/ws/2/recording?query=${query}&limit=1&fmt=json`;
        
        
        // 发送 GET 请求
        const response = await axios.get(url);

        // 检查响应状态码
        if (response.status === 200) {
            const data = response.data;
            // 检查是否有搜索结果
            if (data.recordings && data.recordings.length > 0) {
                // 返回第一个搜索结果的专辑 ID 
                const recording = data.recordings[0];
                if(recording.releases && recording.releases.length > 0) {
                    console.log(recording.releases[0].id);
                    return recording.releases[0].id;
                } else{
                    console.log("未找到符合条件的专辑。");
                }
            } else {
                console.log("未找到符合条件的歌曲。");
            }
        } else {
            console.log("请求 MusicBrainz API 时出错。");
        }
    } catch (error: any) {
        console.error("发生错误:", error.message);
    }
    return null;
}

/**
 * 获取专辑封面图片 URL
 * @param mbid 专辑 ID
 * @param imageId 图片 ID
 * @param size 图片尺寸
 * @returns 专辑封面图片 URL
 */
static async getMusicBrainzSongId(songName: string, albumName: string, strictMode?: boolean): Promise<string | null> {
    try {
        if(!strictMode) {
            strictMode = false;
        }
        // MusicBrainz API endpoint
        let query = `recording:"${encodeURIComponent(songName)}"`;
        if (strictMode) {
            // 严格模式下，搜索结果必须严格包含专辑名
            query += ` AND release:"${encodeURIComponent(albumName)}"`;
        } else {
            // 非严格模式下，专辑名模糊匹配
            query += ` AND release:${encodeURIComponent(albumName)})`;
        }

        // MusicBrainz API endpoint
        const url = `https://musicbrainz.org/ws/2/recording?query=${query}&limit=1&fmt=json`;
        
        // 发送 GET 请求
        const response = await axios.get(url);

        // 检查响应状态码
        if (response.status === 200) {
            const data = response.data;
            // 检查是否有搜索结果
            if (data.recordings && data.recordings.length > 0) {
                // 返回第一个搜索结果的 MusicBrainz ID
                return data.recordings[0].id;
            } else {
                console.log("未找到符合条件的歌曲。");
            }
        } else {
            console.log("请求 MusicBrainz API 时出错。");
        }
    } catch (error: any) {
        console.error("发生错误:", error.message);
    }
    return null;
}


/**
 * 获取专辑封面图片 URL
 * @param mbid 专辑 ID
 * @param imageId 图片 ID
 * @param size 图片尺寸
 * @returns 专辑封面图片 URL
 */
static getAlbumCoverImageUrl(mbid: string, imageId?: string | 'front' | 'back', size?: 250 | 500 | 1200): string {
    if (!imageId) {
        imageId = 'front'; // 默认为封面图片
    }
    if (!size) {
        size = 1200; // 默认为 250
    }
    return `https://coverartarchive.org/release/${mbid}/${imageId}-${size}.jpg`;
}

/**
 * 获取专辑封面图片 URL
 * @param songName 歌曲名
 * @param albumName 专辑名
 * @param size 图片尺寸
 * @returns 专辑封面图片 URL
 */
static getCover(songName: string, albumName: string, size?: 250 | 500 | 1200): Promise<string | null> {
    return MusicBrainzAPI.getMusicBrainzAlbumId(songName, albumName)
        .then((musicbrainzId) => {
            if (musicbrainzId) {
                return MusicBrainzAPI.getAlbumCoverImageUrl(musicbrainzId, undefined, size);
            } else {
                return null;
            }
        });
}

    

    static test() {
    
// 使用示例
const musicBrainzId = "76df3287-6cda-33eb-8e9a-044b5e15ffdd";
const size = 250; // 或者 500 或 1200

const imageUrl =MusicBrainzAPI.getAlbumCoverImageUrl(musicBrainzId, undefined, size); // 不传入 imageId，默认为封面图片
console.log("专辑封面图片 URL:", imageUrl);

// 调用函数并传入歌曲名和专辑名
const songName = "My Shot";
const albumName = "Hamilton";
console.log("正在获取专辑封面图片...");
MusicBrainzAPI.getCover(songName, albumName, size)
    .then((imageUrl) => {
        if (imageUrl) {
            console.log("专辑封面图片 URL:", imageUrl);
        } else {
            console.log("未找到专辑封面图片。");
        }
    });
    }
}

export { MusicBrainzAPI };