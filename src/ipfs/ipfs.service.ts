import { HttpService } from "@nestjs/axios";
import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as FormData from "form-data";
import { readFile } from "fs-extra";
import { lastValueFrom } from "rxjs";

@Injectable()
export class IpfsService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async checkIPFSConfiguration() {
    const ipfsHost = this.configService.get("ipfsHost");
    const postObservable = this.httpService.post(`${ipfsHost}/repo/version`);

    const data = await lastValueFrom(postObservable)
      .then(data => {
        if (data.status == 200) {
          return {
            connected: true,
            message: "IPFS configuration is valid.",
          };
        }
      })
      .catch(error => {
        return {
          connected: false,
          message: `IPFS系統 故障無法上傳，請檢查設定。 ${error}`,
        };
      });
    return data;
  }
  async ipfsAdd(dirPath: string) {
    const outputData = await readFile(`${dirPath}/data.json`, "utf8");
    const outputHtml = await readFile(`${dirPath}/index.html`, "utf8");

    const formData = new FormData();
    formData.append("file", outputData, { filename: "data.json" });
    formData.append("file", outputHtml, { filename: "index.html" });

    const getConfig = {
      headers: { "Content-Type": "multipart/form-data" },
      baseURL: this.configService.get("ipfsHost"),
      params: { "wrap-with-directory": true },
    };
    const postObservable = this.httpService.post("/add", formData, getConfig);

    const data = await lastValueFrom(postObservable)
      .then(data => {
        const dataArray = data.data.split("\n");
        dataArray.pop();
        const parsedData = dataArray.map(item => {
          if (item !== "") {
            return JSON.parse(item);
          } else {
            return null;
          }
        });
        return parsedData;
      })
      .catch(err => {
        throw new ServiceUnavailableException({
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: "IPFS 節點故障無回應，無法進行發佈。",
          errorDetails: err.message,
        });
      });
    return data[2].Hash;
  }
}
