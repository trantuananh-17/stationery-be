import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetGoalProgressQuery } from './get-goal-progress.query';
import { IGoalTrackingQueryRepository } from '../../ports/queries/goal-tracking-query.repository';

@QueryHandler(GetGoalProgressQuery)
export class GetGoalProgressHandler implements IQueryHandler<GetGoalProgressQuery> {
  constructor(private readonly repository: IGoalTrackingQueryRepository) {}

  async execute(query: GetGoalProgressQuery) {
    return this.repository.getProgress(query.bucketMonth);
  }
}
