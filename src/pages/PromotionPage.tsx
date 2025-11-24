import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PromotionList from "../components/PromotionList";
import api from "../utils/api";
import type PartialPromotionData from "../utils/partialPromotionData";
import Promotion from "../components/Promotion";
import "./PromotionPage.css";
import type PromotionData from "../utils/promotionData";

export default function PromotionPage() {
  const id = useParams().id;
  const [promotions, setPromotions] = useState(
    new Array<PartialPromotionData>()
  );
  useEffect(() => {
    api.loadPromotions().then(setPromotions);
  }, []);

  function updatePromotion(newPromotion: PromotionData) {
    console.log("update promotion : ");
    console.log(newPromotion);

    setPromotions((promotions) =>
      promotions.map((promotion) =>
        promotion.id == newPromotion?.id ? newPromotion.toPartial() : promotion
      )
    );
  }

  function deletePromotion(id: string) {
    setPromotions((promotions) =>
      promotions.filter((promotion) => promotion.id != id)
    );
  }

  return (
    <div id="promotionPage">
      <section className="content-padding">
        <h2>Liste des promotions</h2>
        <PromotionList promotions={promotions} />
      </section>
      {id && (
        <section className="flex-center">
          <Promotion
            key={id}
            id={id}
            onUpdate={updatePromotion}
            onDelete={() => deletePromotion(id)}
          />
        </section>
      )}
    </div>
  );
}
