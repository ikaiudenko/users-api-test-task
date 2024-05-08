import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, UserCreateDto } from '../../../../@common/src';
import { CustomFilesInterceptor } from './file.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '../api-key/api.key.guard';

@Controller('users')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  description: 'Api key generated by admin',
  required: true,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'), new CustomFilesInterceptor())
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() user: UserCreateDto,
  ): Promise<IUser> {
    user.setAvatar(file.buffer);

    return this.userService.createUser(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<IUser> {
    return this.userService.getById(id);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string): Promise<Pick<IUser, 'avatar'>> {
    return this.userService.getAvatar(id);
  }

  @Delete(':id/avatar')
  deleteAvatar(@Param('id') id: string): void {
    this.userService.deleteAvatar(id);
  }
}
