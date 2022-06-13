import ApiService from "../ApiService";

export default class VideoApiService extends ApiService {
  videoEndpoint = "/video";

  buildVideoUrl(videoId) {
    let baseUri = this.videoEndpoint;
    if (!videoId) return baseUri;
    return `${baseUri}/${videoId}`;
  }

  async getVideos() {
    return await this.get(this.videoEndpoint);
  }

  async getVideoById(videoId) {
    const url = this.buildVideoUrl(videoId);
    return await this.get(url);
  }

  async createVideo(data) {
    //   const customHeader =  {
    //     "Content-Type": "multipart/form-data",
    //   }
    return await this.post(this.videoEndpoint, data);
  }

  async updateVideo(videoId, formData) {
    console.log(videoId, formData);
    const url = this.buildVideoUrl(videoId);

    return await this.put(url, formData);
  }

  async deleteVideo(videoId) {
    const url = this.buildVideoUrl(videoId);

    return await this._delete(url);
  }
}
