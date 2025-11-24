export default class PartialPromotionData {
  private _id: string;
  public name: string;
  public formationDescription: string;
  public createdAt: Date;
  public startDate: Date;
  public endDate: Date;
  public students: Array<string>;

  constructor(
    id: string,
    name: string,
    formformationDescription: string,
    createdAt: Date,
    startDate: Date,
    endDate: Date,
    students: string[]
  ) {
    this._id = id;
    this.name = name;
    this.formationDescription = formformationDescription;
    this.createdAt = createdAt;
    this.startDate = startDate;
    this.endDate = endDate;
    this.students = students;
  }

  public get id(): string {
    return this._id;
  }

  static fromObject(object: {
    _id: string;
    name: string;
    formationDescription: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    students: string[];
  }) {
    return new PartialPromotionData(
      object._id,
      object.name,
      object.formationDescription,
      new Date(object.createdAt),
      new Date(object.startDate),
      new Date(object.endDate),
      object.students
    );
  }
}
