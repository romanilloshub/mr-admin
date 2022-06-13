/**
 * Class to mock a webAPI connection
 * @export
 * @class FakeService
 */
export default class FakeService {
  _latencyDuration = 0;
  _errorProbability = 0;

  /**
   * Creates an instance of FakeService.
   * @param {number} [latencyDuration=0]  // in milliseconds
   * @param {number} [errorProbability=0] // use to induce an error to test all edge cases
   * @memberof FakeService
   */
  constructor(latencyDuration = 0, errorProbability = 0) {
    this._latencyDuration = latencyDuration || this._latencyDuration;
    this._errorProbability = errorProbability || this._errorProbability;
  }

  buildApiSuccess = (data, status = 200) => {
    // return {
    //   data: data,
    //   status: status,
    //   statusText: "",
    // };
    return data;
  };

  /**
   * TEMP
   *
   * @param {*} status
   * @param {*} property
   * @param {*} message
   * @return {*}  {ApiError}
   */
  buildApiError = (status, property, message) => {
    return { error: { status, property, message } };
  };

  /**
   * Wraps a Promise that pretends to be consuming a webAPI
   *
   * @protected
   * @template R
   * @param {(input?: any) => R} successCallback
   * @param {(input?: any) => ApiError} errorCallback
   * @return {*}  {Promise<any>}
   * @memberof FakeService
   */
  simulateRequest(
    successCallback, //: (input?: any) => R
    errorCallback //(input?: any) => ApiError | any
  ) {
    //: Promise<any>
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() * 100 > this._errorProbability
          ? resolve(successCallback && successCallback())
          : reject(errorCallback && errorCallback());
      }, this._latencyDuration);
    });
  }
}
