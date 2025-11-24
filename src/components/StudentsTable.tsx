import type StudentData from "../utils/studentData";
import { useEffect, useState, type FormEvent } from "react";
import api from "../utils/api";
import "./StudentsTable.css";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";

type FormStateType = "editing" | "deleting" | null;

export default function StudentsTable({
  promoId,
  initStudents,
  onUpdate,
}: {
  promoId: string;
  initStudents: StudentData[];
  onUpdate: (datas: StudentData[]) => void;
}) {
  const [students, setStudents] = useState<StudentData[]>(initStudents);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  function handleStudentDelete(studentId: string) {
    toast
      .promise(api.deleteStudent(promoId, studentId), {
        pending: "Suppression d'un étudiant...",
        success: "L'étudiant a été supprimé",
        error: "L'étudiant n'as pas pue être supprimé",
      })
      .then(() => {
        const newStudents = students.filter(
          (student) => student.id != studentId
        );
        setStudents(newStudents);
        onUpdate(newStudents);
      });
  }

  async function handleStudentEdit(studentId: string, data: FormData) {
    return toast
      .promise(api.editStudentInPromo(promoId, studentId, data), {
        pending: "Modification de l'étudiant...",
        success: "L'étudiant a été modifié",
        error: "L'étudiant n'as pas pue être modifié",
      })
      .then((newStudent) => {
        const newStudents = students.map((student) =>
          student.id == studentId ? newStudent : student
        );
        setStudents(newStudents);
        onUpdate(newStudents);
      });
  }

  async function handleStudentAdd(data: FormData) {
    return toast
      .promise(api.addStudentToPromo(promoId, data), {
        pending: "Ajout de l'étudiant...",
        success: "L'étudiant a été ajouté",
        error: "L'étudiant n'as pas pue être ajouté",
      })
      .then((student) => {
        const newStudents = students.slice();
        newStudents.push(student);
        setStudents(newStudents);
        setIsAddingStudent(false);
        onUpdate(newStudents);
      });
  }

  return (
    <>
      <button
        disabled={isAddingStudent}
        onClick={() => setIsAddingStudent(true)}
      >
        Ajouter étudiant
      </button>
      {students.length == 0 ? (
        <p>Aucun étudiant enregistré</p>
      ) : (
        <table className="students-table">
          <tbody>
            <tr>
              <th>Avatar</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
            {students.map((student) => (
              <StudentLine
                key={student.id}
                promoId={promoId}
                student={student}
                onDelete={() => handleStudentDelete(student.id)}
                onValidation={(data) => handleStudentEdit(student.id, data)}
              />
            ))}
            {isAddingStudent && (
              <StudentEditLine
                onCancel={() => setIsAddingStudent(false)}
                onValidation={handleStudentAdd}
              />
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

export function StudentLine({
  promoId,
  student,
  onDelete,
  onValidation,
}: {
  promoId: string;
  student: StudentData;
  onDelete: VoidFunction;
  onValidation: (data: FormData) => Promise<void>;
}) {
  const [formState, setFormState] = useState<FormStateType>(null);
  const [avatarSrc, setAvatarSrc] = useState("/assets/img/loading.gif");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    api.getStudentAvatarInPromo(promoId, student.id).then(setAvatarSrc);
  }, [promoId, student.id]);

  if (formState == "editing")
    return (
      <StudentEditLine
        student={student}
        onCancel={() => setFormState(null)}
        onValidation={async (data) => {
          await onValidation(data);
          setFormState(null);
          api.getStudentAvatarInPromo(promoId, student.id).then(setAvatarSrc);
        }}
      />
    );
  else
    return (
      <tr>
        <td className="img-container">
          <img src={avatarSrc} alt="Avatar" />
        </td>
        <td>{student.firstName}</td>
        <td>{student.lastName}</td>
        <td>{student.age}</td>
        <td>
          <button
            className="red"
            onClick={() => {
              setIsConfirmationOpen(true);
            }}
            disabled={formState != null}
          >
            Supprimer
          </button>
          <button
            onClick={() => setFormState("editing")}
            disabled={formState != null}
          >
            Modifier
          </button>
          {isConfirmationOpen && (
            <ConfirmationModal
              prompt="Souhaitez-vous vraiment supprimer cet étudiant ?"
              yes="Oui"
              no="Non"
              onConfirmation={() => {
                setFormState("deleting");
                setIsConfirmationOpen(false);
                onDelete();
              }}
              onCancel={() => setIsConfirmationOpen(false)}
            />
          )}
        </td>
      </tr>
    );
}

export function StudentEditLine({
  student,
  onCancel,
  onValidation,
}: {
  student?: StudentData;
  onCancel: VoidFunction;
  onValidation: (data: FormData) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(student?.firstName);
  const [lastName, setLastName] = useState(student?.lastName);
  const [age, setAge] = useState(student?.age);
  const [isSending, setIsSending] = useState(false);

  async function handleValidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    try {
      await onValidation(new FormData(event.currentTarget));
    } catch (error) {}
    setIsSending(false);
  }

  return (
    <tr>
      <td>
        <input form="studentEdit" type="file" name="avatar" />
      </td>
      <td>
        <input
          form="studentEdit"
          type="text"
          name="firstName"
          value={firstName}
          onInput={(e) => setFirstName(e.currentTarget.value)}
          maxLength={20}
          disabled={isSending}
        />
      </td>
      <td>
        <input
          form="studentEdit"
          type="text"
          name="lastName"
          value={lastName}
          onInput={(e) => setLastName(e.currentTarget.value)}
          maxLength={20}
          disabled={isSending}
        />
      </td>
      <td>
        <input
          form="studentEdit"
          type="number"
          name="age"
          value={age}
          min={0}
          onInput={(e) => setAge(Number.parseInt(e.currentTarget.value))}
          max={62}
          disabled={isSending}
        />
      </td>
      <td>
        <form id="studentEdit" onSubmit={handleValidate} />
        <button className="red" onClick={onCancel} disabled={isSending}>
          Annuler
        </button>
        <button form="studentEdit" type="submit" disabled={isSending}>
          Valider
        </button>
      </td>
    </tr>
  );
}
