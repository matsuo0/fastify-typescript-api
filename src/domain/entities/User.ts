// ドメインエンティティ: User
export class User {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _age?: number,
    private _phone?: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  // ゲッター
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get age(): number | undefined {
    return this._age;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ビジネスメソッド
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this._email = email.toLowerCase();
    this._updatedAt = new Date();
  }

  updateAge(age: number | undefined): void {
    if (age !== undefined && (age < 0 || age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }
    this._age = age;
    this._updatedAt = new Date();
  }

  updatePhone(phone: string | undefined): void {
    if (phone !== undefined && !this.isValidPhone(phone)) {
      throw new Error('Invalid phone format');
    }
    this._phone = phone;
    this._updatedAt = new Date();
  }

  // バリデーション
  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Name is required');
    }

    if (!this.isValidEmail(this._email)) {
      throw new Error('Invalid email format');
    }

    if (this._age !== undefined && (this._age < 0 || this._age > 150)) {
      throw new Error('Age must be between 0 and 150');
    }

    // 電話番号のバリデーションは既存データとの互換性のため緩和
    if (this._phone !== undefined && this._phone !== null && this._phone.trim() !== '') {
      if (!this.isValidPhone(this._phone)) {
        // 既存データのため、バリデーションエラーをスローせずにログ出力のみ
        console.warn(`Warning: Invalid phone format for user ${this._id}: ${this._phone}`);
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // より柔軟な電話番号バリデーション（既存データとの互換性のため）
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    return phoneRegex.test(phone);
  }

  // ファクトリメソッド
  static create(
    name: string,
    email: string,
    age?: number,
    phone?: string
  ): User {
    const id = Date.now().toString();
    return new User(id, name, email, age, phone);
  }

  static fromData(data: {
    id: string;
    name: string;
    email: string;
    age?: number;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.age,
      data.phone,
      data.createdAt,
      data.updatedAt
    );
  }

  // データ変換
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      age: this._age,
      phone: this._phone,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
