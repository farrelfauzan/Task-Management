import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const newComment = this.commentRepository.create(createCommentDto);
      return await this.commentRepository.save(newComment);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository.find({
        relations: {
          user: true,
        },
      });
      return comments;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
      });
      return comment;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
      });
      if (!comment) return null;
      const updatedComment = await this.commentRepository.save({
        ...comment,
        ...updateCommentDto,
      });
      return updatedComment;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
      });
      if (!comment) return false;
      await this.commentRepository.remove(comment);
      return true;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
