export default class StudentData {
  private _id: string;
  public firstName: string;
  public lastName: string;
  public age: number;

  constructor(_id: string, firstName: string, lastName: string, age: number) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  public get id(): string {
    return this._id;
  }

  static fromObject(object: {
    _id: string;
    firstName: string;
    lastName: string;
    age: number;
  }) {
    return new StudentData(
      object._id,
      object.firstName,
      object.lastName,
      object.age
    );
  }
}
