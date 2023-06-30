import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import * as FormData from "form-data";
import { readFile } from "fs-extra";
import { basename } from "path";
import { lastValueFrom } from "rxjs";
import ipfsConfig from "src/config/ipfs.config";

@Injectable()
export class IpfsService {
  constructor(private readonly httpService: HttpService) {}

  getConfig = {
    baseURL: ipfsConfig().ipfsHost,
  };
  async ipfsAdd(filePath: string) {
    class ipfsData {
      Name: string;
      Hash: string;
      Size: number;
    }

    const templateContent = await readFile(filePath, "utf8");
    const formData = new FormData();
    const fileName = basename(filePath);
    formData.append("file", templateContent, { filename: fileName });

    const response = this.httpService.post("/add", formData, this.getConfig);
    const resposeData: ipfsData = (await lastValueFrom(response)).data;
    return resposeData;
  }
}
