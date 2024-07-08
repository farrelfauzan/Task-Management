import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = await encodePassword(createUserDto.password);
      const newUser = this.userRepository.create({
        ...createUserDto,
        password,
        role: createUserDto.role || UserRole.USER,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.tasks', 'tasks')
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.role',
          'user.isActive',
          'tasks.id',
          'tasks.title',
          'tasks.description',
          'tasks.status',
          'tasks.dueDate',
        ])
        .getMany();
      return users;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .select([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
          'user.role',
          'user.isActive',
        ])
        .getOne();
      if (!user) {
        throw new Error('User not found');
      }
      await this.userRepository.update(id, updateUserDto);
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new Error('User not found');
      }
      await this.userRepository.delete(id);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const findUserByEmail = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.tasks', 'tasks')
        .leftJoinAndSelect('tasks.comments', 'comments')
        .leftJoinAndSelect('comments.user', 'commentUser')
        .where('user.email = :email', { email })
        .select([
          'user.id',
          'user.firstName',
          'user.password',
          'user.lastName',
          'user.email',
          'user.role',
          'user.isActive',
          'tasks.id',
          'tasks.title',
          'tasks.description',
          'tasks.status',
          'tasks.dueDate',
          'comments.id',
          'comments.content',
          'commentUser.id',
          'commentUser.username',
        ])
        .getOne();
      this.logger.log(findUserByEmail);
      return findUserByEmail;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
