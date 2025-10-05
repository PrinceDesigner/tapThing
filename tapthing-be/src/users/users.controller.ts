import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SupabaseAuthGuard } from '../guard/supabase.guard';
import { CurrentUser } from '../common/decoratores/current-user.decorator';
import { User } from './model/user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly users: UsersService) { }

    @Get('/me')
    getOne(@CurrentUser('id') userId: string) {
        return this.users.findById(userId);
    }

    @Post('/modifica')
    update(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateUserDto
    ) {
        return this.users.update(userId, dto);
    }
}
