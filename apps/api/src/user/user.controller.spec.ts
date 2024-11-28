import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { ImageUploadService } from '../imageUpload/imageUpload.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Genre, InstrumentName } from '@shared/enums';

// Mock data for a user
const mockUser = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
  password: 'securepassword',
  phone: '1234567890',
  location: {
    city: 'Sample City',
    postCode: '12345',
  },
  isSeeking: true,
  subscribedToNewsletter: false,
};

// Mock data for an updated user
const updatedUser = { ...mockUser, name: 'Jane' };

// Mock data for an instrument
const mockInstrument = {
  name: InstrumentName.NaturalHorn, 
  level: 2, 
  genres: [Genre.BAROK, Genre.ROMANTISK], 
};


// Mock data for uploaded image
const mockUploadResult = {
  secure_url: 'http://example.com/profile.jpg',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let imageUploadService: ImageUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findUserById: jest.fn().mockResolvedValue(mockUser),
            findUserByEmail: jest.fn().mockResolvedValue(mockUser),
            updateUser: jest.fn().mockResolvedValue(updatedUser),
            deleteUser: jest.fn().mockResolvedValue(undefined),
            updateUserByEmail: jest.fn().mockResolvedValue(updatedUser),
            addInstrument: jest.fn().mockResolvedValue({ ...mockUser, instruments: [mockInstrument] }),
            deleteInstrument: jest.fn().mockResolvedValue({ ...mockUser, instruments: [] }),
          },
        },
        {
          provide: ImageUploadService,
          useValue: {
            uploadImage: jest.fn().mockResolvedValue(mockUploadResult),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    imageUploadService = module.get<ImageUploadService>(ImageUploadService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = { name: 'John', email: 'john@example.com', password: 'securepassword' };
    const result = await usersController.create(userDto);
    expect(usersService.createUser).toHaveBeenCalledWith(userDto);
    expect(result).toEqual(mockUser);
  });

  it('should return an array of users', async () => {
    const result = await usersController.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('should return a user profile', async () => {
    const req = { user: { userId: '123' } };
    const result = await usersController.getProfile(req);
    expect(usersService.findUserById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockUser);
  });

  it('should find a user by email', async () => {
    const email = 'john@example.com';
    const result = await usersController.findByEmail(email);
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockUser);
  });

  it('should update a user', async () => {
    const userId = '123';
    const updateUserDto = { name: 'Jane' };
    const result = await usersController.update(userId, updateUserDto);
    expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    expect(result.name).toBe('Jane');
  });

  it('should update a user profile with an image', async () => {
    const email = 'john@example.com';
    const image = { originalname: 'test.jpg', buffer: Buffer.from('test') } as Express.Multer.File;
    const userDto = { name: 'Jane' };
    const result = await usersController.updateProfile(email, image, userDto);

    expect(imageUploadService.uploadImage).toHaveBeenCalledWith(image, 'profile');
    expect(usersService.updateUserByEmail).toHaveBeenCalledWith(email, {
      ...userDto,
      profilePicture: mockUploadResult.secure_url,
    });
    expect(result.name).toBe('Jane');
  });

  it('should delete a user', async () => {
    const userId = '123';
    await usersController.remove(userId);
    expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
  });

  it('should add an instrument to a user', async () => {
    const email = 'john@example.com';
    const result = await usersController.addInstrument(email, mockInstrument);
    expect(usersService.addInstrument).toHaveBeenCalledWith(email, mockInstrument);
    expect(result.instruments).toContainEqual(mockInstrument);
  });

  it('should delete an instrument from a user', async () => {
    const email = 'john@example.com';
    const index = 0;
    const result = await usersController.deleteInstrumentByEmail(email, { index });
    expect(usersService.deleteInstrument).toHaveBeenCalledWith(email, index);
    expect(result.instruments).not.toContainEqual(mockInstrument);
  });
});
