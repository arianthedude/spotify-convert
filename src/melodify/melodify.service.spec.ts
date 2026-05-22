import { Test, TestingModule } from '@nestjs/testing';
import { MelodifyService } from './melodify.service';

describe('MelodifyService', () => {
  let service: MelodifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MelodifyService],
    }).compile();

    service = module.get<MelodifyService>(MelodifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
