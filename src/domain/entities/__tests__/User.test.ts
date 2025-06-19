import { User, UserEntity } from '../User';

describe('User Entity', () => {
  describe('UserEntity.create', () => {
    it('should create a user with valid email', () => {
      const email = 'test@example.com';
      const user = UserEntity.create(email);

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.email).toBe(email);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different users', () => {
      const user1 = UserEntity.create('user1@example.com');
      const user2 = UserEntity.create('user2@example.com');

      expect(user1.id).not.toBe(user2.id);
    });

    it('should set createdAt to current date', () => {
      const beforeCreation = new Date();
      const user = UserEntity.create('test@example.com');
      const afterCreation = new Date();

      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });

  describe('UserEntity constructor', () => {
    it('should create user from existing data', () => {
      const userData: User = {
        id: 'test-id',
        email: 'test@example.com',
        createdAt: new Date('2023-01-01')
      };

      const user = new UserEntity(userData);

      expect(user.id).toBe(userData.id);
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toEqual(userData.createdAt);
    });
  });
}); 