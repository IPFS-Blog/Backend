import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { recoverPersonalSignature } from "eth-sig-util";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { GenerateNonceDto, LoginDto } from "./dto/auth-address-dto";
import { AuthConfirmDto } from "./dto/auth-confirm-dto";
import { JwtUser } from "./jwt/jwt.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(userDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: userDto.email },
        { address: userDto.address },
        { username: userDto.username },
      ],
    });

    if (existingUser) {
      const keys = ["email", "address", "username"];
      const conflictedAttributes: string[] = [];

      keys.forEach(key => {
        if (existingUser[key] === userDto[key]) {
          conflictedAttributes.push(`${key} 已被註冊。`);
        }
      });

      throw new ConflictException(conflictedAttributes);
    }

    return this.usersService.create(userDto);
  }
  async generateNonce(MetaMaskDto: GenerateNonceDto) {
    const { address } = MetaMaskDto;
    const nonce = uuidv4();
    const user_data = await this.usersService.findByMetaMask(address);
    if (!user_data) {
      throw new NotFoundException({
        message: "無此使用者。",
      });
    }
    const user = new User();
    user.id = user_data.id;
    user.address = address;
    user.nonce = nonce;
    await user.save();
    return {
      statusCode: HttpStatus.CREATED,
      nonce: nonce,
    };
  }
  async generateToken(MetaMaskDto: LoginDto) {
    const { address, signature } = MetaMaskDto;
    const user_data = await this.usersService.findByMetaMask(address);

    if (!user_data) {
      throw new NotFoundException({
        message: "無此使用者。",
      });
    }

    if (!user_data.emailVerified) {
      throw new ForbiddenException({
        message: "信箱未驗證。",
      });
    }

    const recoveredAddr = recoverPersonalSignature({
      data: user_data.nonce,
      sig: signature,
    });

    if (recoveredAddr.toLowerCase() !== address.toLowerCase()) {
      throw new UnprocessableEntityException({
        message: "Signature is not correct.",
      });
    }

    const payload: JwtUser = {
      id: user_data.id,
    };
    const userData = {
      id: user_data.id,
      username: user_data.username,
      address: address,
      email: user_data.email,
      picture: user_data.picture,
      background: user_data.background,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      statusCode: HttpStatus.CREATED,
      access_token,
      userData,
    };
  }

  async emailAccountConfirm(dto: AuthConfirmDto) {
    const user_data = await this.usersService.findEmail(dto.email);
    if (!user_data) {
      throw new NotFoundException({
        message: "無此使用者。",
      });
    }
    if (user_data.confirmCode != dto.confirmCode) {
      throw new ForbiddenException({
        message: "驗證碼錯誤。",
      });
    }
    await this.usersService.emailVerified(user_data.id);
    return {
      statusCode: HttpStatus.OK,
      message: "驗證成功",
    };
  }
}
