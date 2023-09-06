import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserData(userId: number) {
    const user_data = await this.findUser(userId);
    const userData = {
      id: user_data.id,
      username: user_data.username,
      address: user_data.address,
      email: user_data.email,
      picture: user_data.picture,
      background: user_data.background,
    };
    return {
      statusCode: HttpStatus.OK,
      userData,
    };
  }

  async generateNonce(userId: number) {
    const nonce = uuidv4();
    this.userRepository.update(userId, {
      nonce: nonce,
    });
    return nonce;
  }

  async findOneByUsername(username: string) {
    const user_data = await this.findByUserName(username);
    if (!user_data) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "無此使用者。",
      });
    }
    const userData = {
      username: user_data.username,
      address: user_data.address,
      email: user_data.email,
      picture: user_data.picture,
      background: user_data.background,
    };
    return {
      statusCode: HttpStatus.OK,
      userData,
    };
  }

  async deleteImg(userId: number, type) {
    if (type == undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "類型不能為空。",
      });
    }
    if (type == "picture") {
      this.userRepository.update(userId, {
        picture: null,
      });
    } else if (type == "background") {
      this.userRepository.update(userId, {
        background: null,
      });
    } else {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "類型只能為 picture 或 background。",
      });
    }
    return {
      statusCode: HttpStatus.OK,
      message: "刪除成功",
    };
  }

  async updateOne(userId: number, userDto: UpdateUserDto) {
    const user_data = await this.findUser(userId);

    const user = {};
    Object.keys(userDto).forEach(key => {
      if (userDto[key] !== user_data[key]) {
        user[key] = userDto[key];
      }
    });

    if (user["email"] || user["username"]) {
      const existingUser = await this.userRepository.find({
        where: [{ email: user["email"] }, { username: user["username"] }],
      });
      const keys = ["email", "username"];
      const conflictedAttributes: string[] = [];

      existingUser.forEach(item => {
        keys.forEach(key => {
          if (user[key] === item[key]) {
            conflictedAttributes.push(`${key} 已被註冊。`);
          }
        });
      });

      throw new ConflictException(conflictedAttributes);
    }
    await this.userRepository.update(user_data.id, user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "修改成功",
    };
  }

  async create(userDto: CreateUserDto) {
    const confirmCode = Math.random().toString().slice(-6);

    const user = this.userRepository.create({
      address: userDto.address,
      username: userDto.username,
      email: userDto.email,
      confirmCode: confirmCode,
    });
    await this.userRepository.save(user);

    await this.mailService.sendAccountConfirm(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }

  async emailVerified(id: number) {
    this.userRepository.update(id, {
      emailVerified: true,
    });
  }

  async findByMetaMask(address) {
    return await this.userRepository.findOne({
      where: {
        address: address,
      },
    });
  }

  async findUser(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByUserName(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
}
