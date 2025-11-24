import { useEffect, useState, type FormEvent } from "react";
import PromotionData from "../utils/promotionData";
import api from "../utils/api";
import StudentsTable from "./StudentsTable";
import Calendar from "./Calendar";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import "./Promotion.css";
import StudentData from "../utils/studentData";

type FormStateType = "editing" | "deleting" | null;
type SubContentType = "students" | "calendar" | null;
type loadingStateType = "loading" | "loaded" | "deleted" | "notFound";

const EVENTS = [
  {
    title: "Présentation des métiers de l'artisan",
    start: "2025-11-17T09:00:00",
    end: "2025-11-17T12:00:00",
    allDay: false,
  },
  {
    title: "Dévelopement Web - Javascript",
    start: "2025-11-19T14:00:00",
    end: "2025-11-19T16:00:00",
    allDay: false,
  },
  {
    title: "Faire son CV",
    start: "2025-11-20T10:00:00",
    end: "2025-11-20T11:00:00",
    allDay: false,
  },
];

export default function Promotion({
  id,
  onUpdate,
  onDelete,
}: {
  id: string;
  onUpdate: (promotion: PromotionData) => void;
  onDelete: VoidFunction;
}) {
  const [promotion, setPromotion] = useState<PromotionData | null>(null);
  const [loadingState, setLoadingState] = useState<loadingStateType>("loading");
  const [formState, setFormState] = useState<FormStateType>(null);
  const [subContent, setSubContent] = useState<SubContentType>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    api.fetchFullPromoDetails(id).then((promotion) => {
      if (promotion) {
        setLoadingState("loaded");
        setPromotion(promotion);
      } else {
        setLoadingState("notFound");
      }
    });
  }, [id]);

  if (promotion == null) {
    switch (loadingState) {
      case "loading":
        return <p className="box">Loading...</p>;
      case "notFound":
        return <p className="box">Cette promotion n'existe pas !</p>;
      case "deleted":
        return <p className="box">Cette promotion a été supprimé !</p>;
    }
    return undefined;
  }

  function handlePromotionDelete() {
    setFormState("deleting");
    toast
      .promise(api.removePromo(id), {
        pending: "Suppression de la promotion...",
        success: "La promotion a été supprimé",
        error: "La promotion n'as pas pue être supprimé",
      })
      .then(() => {
        setLoadingState("deleted");
        setPromotion(null);
        setFormState(null);
        onDelete();
      });
  }

  async function handlePromotionEdit(formData: FormData) {
    return toast
      .promise(api.editPromo(id, formData), {
        pending: "Modification de la promotion...",
        success: "La promotion a été modifié",
        error: "La promotion n'as pas pue être modifié",
      })
      .then((response) => {
        const newPromotion = new PromotionData(
          response.id,
          response.name,
          response.formationDescription,
          response.createdAt,
          response.startDate,
          response.endDate,
          promotion!.students
        );
        setPromotion(newPromotion);
        setFormState(null);
        onUpdate(newPromotion);
      });
  }

  function handleStudentUpdate(datas: StudentData[]) {
    const students = new Map<string, StudentData>();
    datas.forEach((student) => students.set(student.id, student));
    const newPromotion = new PromotionData(
      promotion!.id,
      promotion!.name,
      promotion!.formationDescription,
      promotion!.createdAt,
      promotion!.startDate,
      promotion!.endDate,
      students
    );
    setPromotion(newPromotion);
    onUpdate(newPromotion);
  }

  return (
    <div className="box promotion" key={id}>
      {formState == "editing" ? (
        <PromotionEditForm
          promotion={promotion}
          onCancel={() => setFormState(null)}
          onValidation={handlePromotionEdit}
        />
      ) : (
        <>
          <h2>{promotion.name}</h2>
          <p>{promotion.formationDescription}</p>
          <ul>
            <li>Créer le : {promotion.createdAt.toLocaleDateString()}</li>
            <li>Date de départ : {promotion.startDate.toLocaleDateString()}</li>
            <li>Date de fin : {promotion.endDate.toLocaleDateString()}</li>
          </ul>
          <div>
            <button
              onClick={() => setFormState("editing")}
              disabled={formState != null}
            >
              Modifier
            </button>
            <button
              className="red"
              onClick={() => setIsConfirmationOpen(true)}
              disabled={formState != null}
            >
              Supprimer
            </button>
          </div>
          {isConfirmationOpen && (
            <ConfirmationModal
              prompt="Souhaitez-vous vraiment supprimer cette promotion ?"
              yes="Oui"
              no="Non"
              onConfirmation={() => {
                setIsConfirmationOpen(false);
                handlePromotionDelete();
              }}
              onCancel={() => setIsConfirmationOpen(false)}
            />
          )}
        </>
      )}

      <div className="sub-content-container">
        <SubContentButtons
          onStudentsClick={() => setSubContent("students")}
          onCalendarClick={() => setSubContent("calendar")}
        />
        {subContent && (
          <div className="sub-content">
            {subContent == "students" && (
              <StudentsTable
                promoId={id}
                initStudents={[...promotion.students.values()]}
                onUpdate={handleStudentUpdate}
              />
            )}
            {subContent == "calendar" && <Calendar events={EVENTS} />}
          </div>
        )}
      </div>
    </div>
  );
}

export function PromotionEditForm({
  promotion,
  onValidation,
  onCancel,
}: {
  promotion: PromotionData;
  onValidation: (formData: FormData) => Promise<void>;
  onCancel: VoidFunction;
}) {
  const [name, setName] = useState(promotion.name);
  const [formationDescription, setFormationDescription] = useState(
    promotion.formationDescription
  );
  const [startDate, setStartDate] = useState(promotion.startDate);
  const [endDate, setEndDate] = useState(promotion.endDate);
  const [isSending, setIsSending] = useState(false);

  async function handleValidation(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsSending(true);
    try {
      await onValidation(
        new FormData(event.currentTarget.form!, event.currentTarget)
      );
    } catch (error) {
      console.error(error);
    }
    setIsSending(false);
  }

  return (
    <form>
      <fieldset>
        <label htmlFor="name">Nom de la promotion :</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          disabled={isSending}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="description">Description de la formation :</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formationDescription}
          onInput={(e) => setFormationDescription(e.currentTarget.value)}
          disabled={isSending}
        />
      </fieldset>
      <ul>
        <li>Créer le : {promotion.createdAt.toLocaleDateString()}</li>
        <li>
          <label htmlFor="startDate">Date de départ : </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={startDate.toISOString().split("T")[0]}
            onInput={(e) => setStartDate(e.currentTarget.valueAsDate!)}
            disabled={isSending}
          />
        </li>
        <li>
          <label htmlFor="endDate">Date de fin : </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={endDate.toISOString().split("T")[0]}
            onInput={(e) => setEndDate(e.currentTarget.valueAsDate!)}
            disabled={isSending}
          />
        </li>
      </ul>
      <div>
        <button onClick={handleValidation} disabled={isSending}>
          Envoyer
        </button>
        <button className="red" onClick={onCancel} disabled={isSending}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export function SubContentButtons({
  onStudentsClick,
  onCalendarClick,
}: {
  onStudentsClick: VoidFunction;
  onCalendarClick: VoidFunction;
}) {
  return (
    <div className="merged-buttons">
      <button className="left" onClick={onStudentsClick}>
        Étudiants
      </button>
      <button className="right" onClick={onCalendarClick}>
        Calendrier
      </button>
    </div>
  );
}
