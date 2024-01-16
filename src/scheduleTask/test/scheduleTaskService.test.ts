import { TasksService } from '../scheduleTasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    // mock dependencies
  });

  it('should get employee list and send notification', async () => {
    // mock return value of getListEmployeeHasToken

    await service.noticeEmployeeCreateManifest();

    // assert getListEmployeeHasToken called
    // assert sendPushNotificationForEmployee called for each user
  });

  it('should handle empty employee list', async () => {
    // mock empty return value

    await service.noticeEmployeeCreateManifest();

    // assert notifications not called
  });

  it('should handle getListEmployeeHasToken error', async () => {
    // mock rejected promise

    await service.noticeEmployeeCreateManifest();

    // assert error handled
  });
});
