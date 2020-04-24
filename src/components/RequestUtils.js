import Config from "../config";

const RequestUtils = {}

RequestUtils.getBackendServerUrl = (url) => {
    if (url.startsWith('/')) {
        return Config.BACKEND_SERVER_URL + url;
    } else {
        return url;
    }
}

export default RequestUtils;