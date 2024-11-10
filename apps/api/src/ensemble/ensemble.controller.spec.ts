import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleController } from './ensemble.controller';
import { EnsembleService } from './ensemble.service';
import { Ensemble } from './schema/ensemble.schema';
import { Types } from 'mongoose';

describe('EnsembleController', () => {
  let controller: EnsembleController;
  let service: EnsembleService;

  const mockEnsembleService = {
    createEnsemble: jest.fn(),
    findAll: jest.fn(),
    updateEnsemble: jest.fn(),
    deleteEnsemble: jest.fn(),
  };

  const mockEnsemble = {
    _id: new Types.ObjectId(),
    name: 'Test Ensemble',
    imageUrl: 'http://example.com/image.jpg',
    description: 'A test ensemble',
    homepageUrl: 'http://example.com',
    location: { city: 'Copenhagen', postCode: '1000' },
    number_of_musicians: 'SOLO',
    practice_frequency: 'WEEKLY',
    genres: ['ROCK'],
    type: ['BAND'],
    member_ids: [new Types.ObjectId()],
  } as unknown as Ensemble;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnsembleController],
      providers: [
        {
          provide: EnsembleService,
          useValue: mockEnsembleService,
        },
      ],
    }).compile();

    controller = module.get<EnsembleController>(EnsembleController);
    service = module.get<EnsembleService>(EnsembleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ensemble', async () => {
      mockEnsembleService.createEnsemble.mockResolvedValue(mockEnsemble);
      const result = await controller.create(mockEnsemble);
      expect(result).toEqual(mockEnsemble);
      expect(mockEnsembleService.createEnsemble).toHaveBeenCalledWith(mockEnsemble);
    });
  });

  describe('findAll', () => {
    it('should return an array of ensembles', async () => {
      mockEnsembleService.findAll.mockResolvedValue([mockEnsemble]);
      const result = await controller.findAll();
      expect(result).toEqual([mockEnsemble]);
      expect(mockEnsembleService.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing ensemble', async () => {
      const updatedEnsemble = { ...mockEnsemble, name: 'Updated Ensemble' };
      mockEnsembleService.updateEnsemble.mockResolvedValue(updatedEnsemble);
      const result = await controller.update(mockEnsemble._id.toString(), updatedEnsemble);
      expect(result).toEqual(updatedEnsemble);
      expect(mockEnsembleService.updateEnsemble).toHaveBeenCalledWith(mockEnsemble._id.toString(), updatedEnsemble);
    });
  });

  describe('remove', () => {
    it('should delete an ensemble', async () => {
      mockEnsembleService.deleteEnsemble.mockResolvedValue(undefined);
      const result = await controller.remove(mockEnsemble._id.toString());
      expect(result).toBeUndefined();
      expect(mockEnsembleService.deleteEnsemble).toHaveBeenCalledWith(mockEnsemble._id.toString());
    });
  });
});
