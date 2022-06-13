import FakeService from "./fake";
import ApiService from "./api";

let service = new ApiService();

if (process.env.REACT_APP_FAKE_API_MODE === "true") {
  service = new FakeService(0, 0);
}

export default service;
