const BASE_URL = import.meta.env.BASE_URL || '/';

export const STATIC_CV_PDF_PATH = '/assets/aistudio/CV_de_Ce_drine_PIGEON-SCHNEIDER_ac537d40.pdf';
export const STATIC_MOODBOARD_PDF_PATH = '/assets/aistudio/Moodboard_-_copie_e766ab12.pdf';
export const STATIC_RECOMMENDATION_LE_QUERE_PDF_PATH =
  '/assets/aistudio/Lettre_de_recommandation_Mai_tre_LE_QUERE_68c06e7e.pdf';
export const STATIC_RECOMMENDATION_POUJADE_PDF_PATH =
  '/assets/aistudio/Mme_POUJADE_recommandation_1c52b927.pdf';

export function withBase(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:|mailto:|tel:|#)/i.test(path)) {
    return path;
  }
  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${cleanPath}`;
}
