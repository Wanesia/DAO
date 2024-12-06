import { Test, TestingModule } from '@nestjs/testing';
import { EnsembleController } from './ensemble.controller';
import { EnsembleService } from './ensemble.service';
import { Ensemble } from './schema/ensemble.schema';
import { Types } from 'mongoose';
import { Genre, EnsembleType, PracticeFrequency, MusicianCount} from '@shared/enums';
import { ImageUploadService } from 'src/imageUpload/imageUpload.service';
import { UsersService } from 'src/user/user.service';
import { LastSeenInterceptor } from 'src/interceptors/lastSeen.interceptor';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    accessToken: string;
  };
}

describe('EnsembleController', () => {
  let controller: EnsembleController;
  let service: EnsembleService;
  let usersService: UsersService;

  const mockEnsembleService = {
    createEnsemble: jest.fn(),
    searchEnsembles: jest.fn(),
  };

  const mockImageUploadService = {
    uploadImage: jest.fn().mockResolvedValue({
      secure_url: 'http://example.com/image.jpg',
    }),
  };

  const mockEnsemble = {
    _id: new Types.ObjectId(),
    name: 'Test Ensemble',
    imageUrl: 'http://example.com/image.jpg',
    description: 'A test ensemble',
    homepageUrl: 'http://example.com',
    location: { city: 'Copenhagen', postCode: '1000' },
    number_of_musicians: MusicianCount.ONE_TO_FOUR,
    practice_frequency: PracticeFrequency.EVERY_OTHER_WEEK,
    genres: [Genre.BAROK, Genre.SENMODERNE],
    type: EnsembleType.CONTINUOUS,
    member_ids: [new Types.ObjectId()],
  } as unknown as Ensemble;

  // Set up before each test
  // Simulating the module setup
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnsembleController],
      providers: [
        {
          // EnsembleService
          provide: EnsembleService,
          useValue: mockEnsembleService,
        },
        {
          // ImageUploadService
          provide: ImageUploadService,
          useValue: mockImageUploadService,
        },
        {
          provide: UsersService,
          useValue: {
            updateLastSeen: jest.fn().mockResolvedValue(true)
          }
        },
        {
          provide: LastSeenInterceptor,
          useFactory: (usersService: UsersService) => 
            new LastSeenInterceptor(usersService),
          inject: [UsersService]
        }
      ],
    }).compile();

    controller = module.get<EnsembleController>(EnsembleController);
    service = module.get<EnsembleService>(EnsembleService);
    usersService = module.get<UsersService>(UsersService);
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Verify that the controller is defined
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ensemble with an image', async () => {
      const mockImage = {
        originalname: 'test.jpg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const formData = {
        name: 'Test Ensemble',
        city: 'Copenhagen',
        postcode: '1000',
        genres: JSON.stringify(['ROCK']),
        type: ['BAND'],
      };

      const mockRequest: AuthenticatedRequest = {
        user: { id: 'creatorId' },
      } as AuthenticatedRequest;

      jest.spyOn(mockEnsembleService, 'createEnsemble').mockResolvedValue(mockEnsemble);

      const result = await controller.create(mockImage, formData, mockRequest);

      expect(result).toEqual(mockEnsemble);

      expect(mockImageUploadService.uploadImage).toHaveBeenCalledWith(mockImage, 'ensembles');

      expect(mockEnsembleService.createEnsemble).toHaveBeenCalledWith(
        {
          ...formData,
          location: { city: 'Copenhagen', postCode: '1000' },
          genres: ['ROCK'],
          image: 'http://example.com/image.jpg',
        },
        'creatorId',
      );
    });
  });

  describe('findEnsembles', () => {
    it('should return a paginated list of ensembles', async () => {
      const mockResponse = { data: [mockEnsemble], total: 1 };

      jest.spyOn(mockEnsembleService, 'searchEnsembles').mockResolvedValue(mockResponse);

      const result = await controller.findEnsembles('test', 1, 6, 'ROCK' as Genre);

      expect(result).toEqual(mockResponse);

      expect(mockEnsembleService.searchEnsembles).toHaveBeenCalledWith('test', 1, 6, 'ROCK');
    });

    it('should handle empty search term and default values', async () => {
      const mockResponse = { data: [mockEnsemble], total: 1 };

      jest.spyOn(mockEnsembleService, 'searchEnsembles').mockResolvedValue(mockResponse);

      const result = await controller.findEnsembles('', 1, 6);

      expect(result).toEqual(mockResponse);

      expect(mockEnsembleService.searchEnsembles).toHaveBeenCalledWith('', 1, 6, undefined);
    });
  });
});
