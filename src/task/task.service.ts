import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(CreateTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const newTask = this.taskRepository.create(CreateTaskDto);
      console.log(newTask);
      return this.taskRepository.save(newTask);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.user', 'user')
        .leftJoinAndSelect('task.comments', 'comment')
        .leftJoinAndSelect('comment.user', 'commentUser')
        .select([
          'task',
          'user.username',
          'user.email',
          'user.id',
          'comment',
          'commentUser.username',
          'commentUser.email',
        ])
        .getMany();

      return tasks;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async findOne(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.user', 'user')
        .select([
          'task.id',
          'task.title',
          'task.description',
          'user.username',
          'user.email',
          'user.id',
        ])
        .where('task.id = :id', { id })
        .getOne();
      return task;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      this.taskRepository.merge(task, updateTaskDto);
      return this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });
      return this.taskRepository.remove(task);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
