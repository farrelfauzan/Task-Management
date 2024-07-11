import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBody({ type: CreateCommentDto })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.createComment(createCommentDto);
  }

  @ApiCreatedResponse({ type: Comment, isArray: true })
  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @ApiCreatedResponse({ type: Comment })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @ApiCreatedResponse({ type: Comment })
  @ApiBody({ type: CreateCommentDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.remove(id);
  }
}
