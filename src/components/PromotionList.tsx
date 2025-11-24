import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import PartialPromotionData from "../utils/partialPromotionData";
import { toast } from "react-toastify";
import "./PromotionList.css";

export default function PromotionList({
  promotions,
  onDelete,
}: {
  promotions: Array<PartialPromotionData>;
  onDelete?: VoidFunction;
}) {
  return (
    <div className="promotion-list">
      {promotions.map((promo) => (
        <Promotion key={promo.id} promo={promo} onDelete={onDelete} />
      ))}
    </div>
  );
}

export function Promotion({
  promo,
  onDelete,
}: {
  promo: PartialPromotionData;
  onDelete?: VoidFunction;
}) {
  const navigate = useNavigate();

  function handleDelete() {
    toast
      .promise(api.removePromo(promo.id), {
        pending: "Suppression d'une promotion...",
        success: "La promotion a été supprimé",
        error: "La promotion n'as pas pue être supprimé",
      })
      .then(() => {
        if (onDelete) onDelete();
      });
  }

  return (
    <article id={promo.id}>
      <h3>{promo.name}</h3>
      <p>{promo.formationDescription}</p>
      <ul>
        <li>Créer le : {promo.createdAt.toLocaleDateString()}</li>
        <li>Date de départ : {promo.startDate.toLocaleDateString()}</li>
        <li>Date de fin : {promo.endDate.toLocaleDateString()}</li>
      </ul>
      <p>
        {promo.students.length == 0
          ? "Aucun étudiant enregistré"
          : `${promo.students.length} étudiants enregistrés`}
      </p>
      <div>
        {onDelete && (
          <button className="red" onClick={handleDelete}>
            Supprimer
          </button>
        )}
        <button onClick={() => navigate("/dashboard/promotion/" + promo.id)}>
          Détails
        </button>
      </div>
    </article>
  );
}
