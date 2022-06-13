import ApiService from "../ApiService";

export default class LinkApiService extends ApiService {
  linkEndpoint = "/link";

  buildLinkUrl(linkId) {
    let baseUri = this.linkEndpoint;
    if (!linkId) return baseUri;
    return `${baseUri}/${linkId}`;
  }

  async getLinks() {
    return await this.get(this.linkEndpoint);
  }

  async getLinkById(linkId) {
    const url = this.buildLinkUrl(linkId);
    return await this.get(url);
  }

  async createLink(data) {
    //   const customHeader =  {
    //     "Content-Type": "multipart/form-data",
    //   }
    return await this.post(this.linkEndpoint, data);
  }

  async updateLink(linkId, formData) {
    const url = this.buildLinkUrl(linkId);

    return await this.put(url, formData);
  }

  async deleteLink(linkId) {
    const url = this.buildLinkUrl(linkId);

    return await this._delete(url);
  }
}
