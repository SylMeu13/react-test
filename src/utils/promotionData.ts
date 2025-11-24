import StudentData from "./studentData";
import PartialPromotionData from "./partialPromotionData";

export default class PromotionData {
  private _id: string;
  public name: string;
  public formationDescription: string;
  public createdAt: Date;
  public startDate: Date;
  public endDate: Date;
  public students: Map<string, StudentData>;

  constructor(
    id: string,
    name: string,
    formformationDescription: string,
    createdAt: Date,
    startDate: Date,
    endDate: Date,
    students: Map<string, StudentData>
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

  toPartial() {
    return new PartialPromotionData(
      this._id,
      this.name,
      this.formationDescription,
      this.createdAt,
      this.startDate,
      this.endDate,
      [...this.students.keys()]
    );
  }

  static fromObject(object: {
    _id: string;
    name: string;
    formationDescription: string;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    students: Array<{
      _id: string;
      firstName: string;
      lastName: string;
      age: number;
    }>;
  }) {
    const students = new Map<string, StudentData>();
    object.students.forEach((student) =>
      students.set(student._id, StudentData.fromObject(student))
    );
    return new PromotionData(
      object._id,
      object.name,
      object.formationDescription,
      new Date(object.createdAt),
      new Date(object.startDate),
      new Date(object.endDate),
      students
    );
  }
}
