import { v4 as uuidv4 } from 'uuid';

export class User {
  uuid: string;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;

constructor(uuid: string, userName: string, email: string, password: string) {
    this.uuid = uuid || uuidv4();
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

static fromJSON(json: any): User {
    return new User(json.uuid, json.userName, json.email, json.password);
}

static toJSON(user: User): any {
    return {
      uuid: user.uuid,
      userName: user.userName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    };
  }

  public static getUserId(user: User): string {
    return user.uuid;
  }
  public static getUserName(user: User): string {
    return user.userName;
  }
  public static getUserEmail(user: User): string {
    return user.email;
  }
  public static getUserCreatedAt(user: User): Date {
    return user.createdAt;
  }
  public static getUserPassword(user: User): string {
    return user.password;
  }
  public static getUser(user: User): User {
    return user;
  }
}
