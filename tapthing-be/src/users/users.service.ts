import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UsersDbService } from './users-db.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';

@Injectable()
export class UsersService {
    constructor(
        private readonly i18n: I18nService,
        private readonly usersDbService: UsersDbService
    ) { }

    async findById(id: string) {
        const user = await this.usersDbService.findOne(id);
        if (!user) {
            const msg = this.i18n.t('errors.USER_NOT_FOUND');
            throw new NotFoundException({ code: 'USER_NOT_FOUND', message: msg });
        }
        return user;
    }


    async update(id: string, dto: Partial<User>) {        
        await this.usersDbService.update(id, dto);
    }
}
