import { HttpModule } from "@nestjs/axios";
import {
  HttpStatus,
  Module,
  OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import ipfsConfig from "src/config/ipfs.config";

import { IpfsService } from "./ipfs.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ipfsConfig],
    }),
    HttpModule,
  ],
  providers: [IpfsService],
  exports: [IpfsService],
})
export class IpfsModule implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private readonly ipfsService: IpfsService,
  ) {}

  async onModuleInit() {
    const env = this.configService.get("app.env");
    if (env != "local") {
      const connectionStatus = await this.ipfsService.checkIPFSConfiguration();
      if (!connectionStatus.connected) {
        throw new ServiceUnavailableException({
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: connectionStatus.message,
        });
      }
    }
  }
}
