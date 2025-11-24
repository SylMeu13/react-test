import APIError from "./apiError";
import PartialPromotionData from "./partialPromotionData";
import PromotionData from "./promotionData";
import StudentData from "./studentData";
import { getToken } from "./token";
const URI = "http://146.59.242.125:3015/";

async function callEndpoint(
  endpoint: string,
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
  body: object | null = null
) {
  return await fetch(URI + endpoint, {
    method: method,
    body: body != null ? JSON.stringify(body) : null,
    headers: {
      Authorization: "Bearer " + getToken(),
      "Content-Type": "application/json",
    },
  });
}

async function sendFormData(
  endpoint: string,
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
  formData: FormData
) {
  return await fetch(URI + endpoint, {
    method: method,
    body: formData,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  });
}

export async function loadPromotions(): Promise<PartialPromotionData[]> {
  const response = await callEndpoint("promos", "GET");

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return (await response.json()).map(PartialPromotionData.fromObject);
}

export async function fetchFullPromoDetails(
  promoId: string
): Promise<PromotionData | null> {
  const response = await callEndpoint("promos/" + promoId, "GET");

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    if (response.status == 404) {
      return null;
    }
    throw new APIError(response);
  }

  return PromotionData.fromObject(await response.json());
}

export async function createPromo(formData: FormData) {
  const response = await callEndpoint("promos", "POST", {
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    formationDescription: formData.get("description"),
  });

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return PromotionData.fromObject((await response.json()).data);
}

export async function removePromo(promoId: string) {
  const response = await callEndpoint("promos/" + promoId, "DELETE");

  if (!response.ok) {
    if (response.status == 404) return false;

    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return true;
}

export async function editPromo(id: string, formData: FormData) {
  const response = await callEndpoint("promos/" + id, "PUT", {
    name: formData.get("name"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    formationDescription: formData.get("description"),
  });

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return PartialPromotionData.fromObject((await response.json()).data);
}

export async function addStudentToPromo(promoId: string, formData: FormData) {
  const response = await sendFormData(
    `promos/${promoId}/students`,
    "POST",
    formData
  );

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return StudentData.fromObject((await response.json()).data);
}

export async function deleteStudent(promoId: string, studentId: string) {
  const response = await callEndpoint(
    `promos/${promoId}/students/${studentId}`,
    "DELETE"
  );

  if (!response.ok) {
    if (response.status == 404) return false;

    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return true;
}

export async function editStudentInPromo(
  promoId: string,
  studentId: string,
  formData: FormData
) {
  const response = await sendFormData(
    `promos/${promoId}/students/${studentId}`,
    "PUT",
    formData
  );

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return StudentData.fromObject((await response.json()).data);
}

export async function getStudentAvatarInPromo(
  promoId: string,
  studentId: string
) {
  const response = await callEndpoint(
    `promos/${promoId}/students/${studentId}/avatar`,
    "GET"
  );

  if (!response.ok) {
    console.error(`Une erreur ${response.status} a eu lieu !`);
    throw new APIError(response);
  }

  return URL.createObjectURL(await response.blob());
}

export default {
  loadPromotions,
  fetchFullPromoDetails,
  createPromo,
  removePromo,
  editPromo,
  addStudentToPromo,
  deleteStudent,
  editStudentInPromo,
  getStudentAvatarInPromo,
};
