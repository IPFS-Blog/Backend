import { JwtModuleAsyncOptions } from "@nestjs/jwt";

import appConfig from "./app.config";

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      secret: appConfig().app.secret,
      signOptions: { expiresIn: "1d" },
    };
  },
};
