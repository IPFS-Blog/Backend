import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async findOneByAddress(address: string) {
    const user_data = await this.findByMetaMask(address);
    if (user_data === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "不存在此使用者。",
      });
    }
    const userData = {
      id: user_data.id,
      name: user_data.username,
      address: user_data.address,
      email: user_data.email,
      photo:
        "https://www.gravatar.com/avatar/490311069a0a679192286d1ab009ae9a?s=800&d=identicon",
    };
    return {
      statusCode: HttpStatus.OK,
      userData,
    };
  }

  async findOneByUsername(username: string) {
    const user_data = await this.findUserName(username);
    if (user_data === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "不存在此使用者。",
      });
    }
    const userData = {
      name: user_data.username,
      address: user_data.address,
      email: user_data.email,
      photo:
        "https://www.gravatar.com/avatar/490311069a0a679192286d1ab009ae9a?s=800&d=identicon",
    };
    return {
      statusCode: HttpStatus.OK,
      userData,
    };
  }

  async updateOne(address: string, userDto: UpdateUserDto) {
    const user_data = await this.findByMetaMask(address);
    if (user_data === null) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "不存在此使用者。",
      });
    }
    const valid_name = await this.findUserName(userDto.username);
    const validator_email = await this.findEmail(userDto.email);
    if (valid_name !== null) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "此名稱已被註冊，請換使用者名稱。",
      });
    } else if (validator_email !== null) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "此信箱已被註冊，請換信箱註冊。",
      });
    }
    await this.repository.update(user_data.id, userDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "修改成功",
    };
  }

  async createByMetaMask(userDto: CreateUserDto) {
    const valid_address = await this.findByMetaMask(userDto.address);
    const valid_name = await this.findUserName(userDto.username);
    const validator_email = await this.findEmail(userDto.email);
    if (valid_address !== null) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "已註冊過，請到登入頁面。",
      });
    } else if (valid_name !== null) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "此名稱已被註冊，請換使用者名稱。",
      });
    } else if (validator_email !== null) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: "此信箱已被註冊，請換信箱註冊。",
      });
    }
    const user = new UserEntity();
    user.address = userDto.address;
    user.username = userDto.username;
    user.email = userDto.email;
    await user.save();
    return {
      statusCode: HttpStatus.CREATED,
      message: "創建成功",
    };
  }

  async findByMetaMask(address) {
    const validator = await UserEntity.findOne({
      where: {
        address: address,
      },
    });
    return validator;
  }

  async findUser(id: number): Promise<UserEntity | undefined> {
    const validator = await UserEntity.findOne({
      where: {
        id: id,
      },
    });
    return validator;
  }

  async findUserName(username: string): Promise<UserEntity | undefined> {
    const validator = await UserEntity.findOne({
      where: {
        username: username,
      },
    });
    return validator;
  }

  async findEmail(email: string): Promise<UserEntity | undefined> {
    const validator = await UserEntity.findOne({
      where: {
        email: email,
      },
    });
    return validator;
  }
}
