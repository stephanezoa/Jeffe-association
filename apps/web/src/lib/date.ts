const FR_DATE = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  // Les dates ISO sans heure sont lues à minuit UTC : sans ce fuseau, les
  // visiteurs à l'ouest de Greenwich verraient la veille.
  timeZone: 'UTC',
});

// Les horodatages portent une heure : on les affiche dans le fuseau du visiteur.
const FR_TIME = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
const FR_DATE_LOCAL = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const capitalizeMonth = (formatted: string) =>
  formatted.replace(/(\d+)\s(\p{Ll})/u, (_match, day: string, initial: string) => `${day} ${initial.toUpperCase()}`);

/**
 * Formate une date ISO en français avec le mois capitalisé : « 23 Juin 2026 ».
 * Retourne la chaîne d'origine si la date est invalide.
 */
export function formatDateFr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return capitalizeMonth(FR_DATE.format(date));
}

/** Formate un horodatage : « 24 Août 2026, 11:16 ». */
export function formatDateTimeFr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return `${capitalizeMonth(FR_DATE_LOCAL.format(date))}, ${FR_TIME.format(date)}`;
}
