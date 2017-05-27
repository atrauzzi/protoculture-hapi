import * as Hapi from "hapi";
import * as moment from "moment";


export function toCommonLogFormat(request: Hapi.Request) {

    const rawReq = request.raw.req;

    const method = rawReq.method;
    const path = rawReq.url;
    const httpProtocol = (rawReq as any).client
        ? (rawReq as any).client.npnProtocol
        : "HTTP/" + rawReq.httpVersion;

    const clientIp = request.info.remoteAddress;
    const clientId = "-";
    const userid = request.id;
    const time = "[" + moment().toISOString() + "]";
    const requestLine = '"' + [method, path, httpProtocol].join(" ") + '"';
    const statusCode = request.response.statusCode;
    const objectSize = "-";

    return [
        clientIp,
        clientId,
        userid,
        time,
        requestLine,
        statusCode,
        objectSize
    ].join(" ");
}
