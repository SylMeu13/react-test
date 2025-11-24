import { useState, useEffect, type FormEvent } from "react";
import PromotionList from "../components/PromotionList";
import api from "../utils/api";
import PartialPromotionData from "../utils/partialPromotionData";
import { toast } from "react-toastify";
import "./PromotionsPage.css";

export default function PromotionsPage() {
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [promotions, setPromotions] = useState(
    new Array<PartialPromotionData>()
  );
  useEffect(() => {
    api.loadPromotions().then(setPromotions);
  }, []);

  return (
    <div id="promotionsPage">
      <section>
        <div className="section-header">
          <h2>Liste des Promotions</h2>
          <button onClick={() => setIsAddingPromo(true)}>
            Ajouter une promo
          </button>
        </div>
        {isAddingPromo && (
          <PromotionAdd
            onClose={() => setIsAddingPromo(false)}
            onAdd={() => api.loadPromotions().then(setPromotions)}
          />
        )}

        <PromotionList
          promotions={promotions}
          onDelete={() => api.loadPromotions().then(setPromotions)}
        />
      </section>
    </div>
  );
}

export function PromotionAdd({
  onClose,
  onAdd,
}: {
  onClose: VoidFunction;
  onAdd: (data: PartialPromotionData) => void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSending(true);
    const form = e.currentTarget;
    toast
      .promise(api.createPromo(new FormData(form)), {
        pending: "Ajout de la promotion...",
        success: "La promotion a été ajouté",
        error: "La promotion n'as pas pue être ajouté",
      })
      .then((promotion) => {
        onAdd(promotion.toPartial());
        setIsSending(false);
        form.reset();
        onClose();
      })
      .catch((__) => {
        setIsSending(false);
      });
  }

  return (
    <form className="box" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="name">Nom de la Promo : </label>
        <input
          type="text"
          name="name"
          id="name"
          pattern="[a-zA-Z0-9 ]{5,}"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="startDate">Date de départ de la Promo : </label>
        <input
          type="date"
          name="startDate"
          id="startDate"
          value={startDate}
          onInput={(e) => setStartDate(e.currentTarget.value)}
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="endDate">Date de fin de la Promo : </label>
        <input
          type="date"
          name="endDate"
          id="endDate"
          value={endDate}
          onInput={(e) => setEndDate(e.currentTarget.value)}
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="description">Description : </label>
        <textarea
          name="description"
          id="description"
          cols={50}
          rows={5}
          value={description}
          onInput={(e) => setDescription(e.currentTarget.value)}
          required
        />
      </fieldset>
      <div>
        <button type="button" onClick={onClose} className="red">
          Annuler
        </button>
        <input type="submit" value="Créer" disabled={isSending} />
      </div>
    </form>
  );
}
