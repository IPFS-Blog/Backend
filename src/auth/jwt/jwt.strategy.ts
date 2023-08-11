import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import appConfig from "src/config/app.config";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().app.secret,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      address: payload.address,
      email: payload.email,
    };
  }
}
