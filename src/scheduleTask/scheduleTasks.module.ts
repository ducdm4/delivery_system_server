import { Module } from '@nestjs/common';
import { TasksService } from './scheduleTasks.service';

@Module({
  imports: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
