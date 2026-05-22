import { Test, TestingModule } from '@nestjs/testing';
import { MelodifyController } from './melodify.controller';

describe('MelodifyController', () => {
  let controller: MelodifyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MelodifyController],
    }).compile();

    controller = module.get<MelodifyController>(MelodifyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
