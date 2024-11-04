import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';


describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  // Mock user data to use in tests
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            updateUser: jest.fn().mockResolvedValue({ ...mockUser, name: 'Jane' }),
            deleteUser: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = { name: 'John', email: 'john@example.com', password: 'securepassword' };
    const result = await usersController.create(userDto);
    expect(usersService.createUser).toHaveBeenCalledWith(userDto);
    expect(result).toEqual(mockUser); // Expect the result to match the mock user
  });

  it('should return an array of users', async () => {
    const result = await usersController.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockUser]); // Expect the result to match the array of mock users
  });
  it('should update a user', async () => {
    const userId = '123';
    const updateUserDto = { name: 'Jane' }; // New data to update
    const result = await usersController.update(userId, updateUserDto);
    expect(usersService.updateUser).toHaveBeenCalledWith(userId, updateUserDto);
    expect(result.name).toBe('Jane'); // Expect the updated name
  });

  it('should delete a user', async () => {
    const userId = '123';
    await usersController.remove(userId);
    expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
  });
});
