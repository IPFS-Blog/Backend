import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/mail/mail.service";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { PatchUserImgDto } from "./dto/patch-user-img.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByAddress(userId: number) {
    const user_data = await this.findUser(userId);
    if (user_data === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "無此使用者。",
      });
    }
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

  async findOneByUsername(username: string) {
    const user_data = await this.findByUsername(username);
    if (user_data === null) {
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

  async updateImg(userId: number, img: PatchUserImgDto) {
    this.userRepository.update(userId, {
      picture: img.picture,
      background: img.background,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: "上傳成功",
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
    if (user_data === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "無此使用者。",
      });
    }
    const valid_name = await this.findByUsername(userDto.username);
    const validator_email = await this.findEmail(userDto.email);
    const user = {};
    Object.keys(userDto).forEach(key => {
      if (userDto[key] !== user_data[key]) {
        user[key] = userDto[key];
      }
    });
    if (valid_name !== null && user["username"] !== undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "此名稱已被註冊，請換使用者名稱。",
      });
    } else if (validator_email !== null && user["email"] !== undefined) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "此信箱已被註冊，請換信箱註冊。",
      });
    }
    await this.userRepository.update(user_data.id, user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "修改成功",
    };
  }

  async createByMetaMask(userDto: CreateUserDto) {
    const valid_address = await this.findByMetaMask(userDto.address);
    const valid_name = await this.findByUsername(userDto.username);
    const validator_email = await this.findEmail(userDto.email);
    if (valid_address !== null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "已註冊過，請到登入頁面。",
      });
    } else if (valid_name !== null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "此名稱已被註冊，請換使用者名稱。",
      });
    } else if (validator_email !== null) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "此信箱已被註冊，請換信箱註冊。",
      });
    }
    const confirmCode = Math.random().toString().slice(-6);

    const user = new User();
    user.address = userDto.address;
    user.username = userDto.username;
    user.email = userDto.email;
    user.confirmCode = confirmCode;
    await user.save();
    await this.mailService.sendAccountConfirm(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }

  async emailVerified(id: number) {
    const user = new User();
    user.id = id;
    user.emailVerified = true;
    await user.save();
  }

  async findByMetaMask(address) {
    const validator = await User.findOne({
      where: {
        address: address,
      },
    });
    return validator;
  }

  async findUser(id: number): Promise<User | undefined> {
    const validator = await User.findOne({
      where: {
        id: id,
      },
    });
    return validator;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const validator = await User.findOne({
      where: {
        username: username,
      },
    });
    return validator;
  }

  async findEmail(email: string): Promise<User | undefined> {
    const validator = await User.findOne({
      where: {
        email: email,
      },
    });
    return validator;
  }
}
