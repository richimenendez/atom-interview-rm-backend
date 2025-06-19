export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export class UserEntity implements User {
  id: string;
  email: string;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }

  static create(email: string): UserEntity {
    return new UserEntity({
      id: crypto.randomUUID(),
      email,
      createdAt: new Date()
    });
  }
} 