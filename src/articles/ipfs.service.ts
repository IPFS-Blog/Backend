import { HttpService } from "@nestjs/axios";
import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import * as FormData from "form-data";
import { readFile } from "fs-extra";
import { lastValueFrom } from "rxjs";
import ipfsConfig from "src/config/ipfs.config";

@Injectable()
export class IpfsService {
  constructor(private readonly httpService: HttpService) {}

  getConfig = {
    headers: { "Content-Type": "multipart/form-data" },
    baseURL: ipfsConfig().ipfsHost,
    params: { "wrap-with-directory": true },
  };
  async ipfsAdd(dirPath: string) {
    const outputData = await readFile(`${dirPath}/data.json`, "utf8");
    const outputHtml = await readFile(`${dirPath}/index.html`, "utf8");

    const formData = new FormData();
    formData.append("file", outputData, { filename: "data.json" });
    formData.append("file", outputHtml, { filename: "index.html" });

    const postObservable = this.httpService.post(
      "/add",
      formData,
      this.getConfig,
    );

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
