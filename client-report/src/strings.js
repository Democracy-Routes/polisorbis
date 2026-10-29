// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-only
//
// Report copy in English and Italian. The language comes from ?lang=, then
// the browser; anything else falls back to English (same rule as the legal
// pages in client-admin). Keys with {x} are filled by fmt().

const en = {
  report: "Report",
  openConversation: "Open the conversation",
  autoRefresh: "Auto-refresh",
  colorBlind: "Colour-blind palette",
  loading: "Loading the report…",
  errorTitle: "Could not load the report",
  errorHttp: "The server answered {status}.",
  errorHint403: "You may need to sign in as the organizer of this conversation.",
  errorHint404: "This report id does not exist.",
  errorOther: "Something went wrong while loading: {error}",
  nothingTitle: "Nothing to show yet",
  nothingText:
    "The report appears once the conversation has statements and at least seven participants have voted. Come back after a few more votes, or switch on auto-refresh.",
  navOverview: "Overview",
  navDivisive: "Divisiveness",
  navMajority: "Majority",
  navGroups: "Groups",
  navUncertainty: "Uncertainty",
  navMap: "Map",
  navAll: "All statements",

  overview: "Overview",
  overviewIntro:
    "Participants vote agree, disagree or pass on short statements, and can write their own. From the votes, participants who voted alike are grouped into opinion groups. This report shows what everyone agreed on, where the groups differ, and where people were unsure.",
  runBy: "This conversation was run by {owner}.",
  topicWas: "The topic was “{topic}”.",
  statVoters: "voters",
  statGrouped: "voters in an opinion group",
  statVotes: "votes cast",
  statStatements: "statements",
  statVotesPerVoter: "votes per voter on average",
  statStatementsPerAuthor: "statements per author on average",

  divisive: "How divisive was the conversation?",
  divisiveIntro:
    "Each dot is a statement. Dots on the left were voted the same way by almost everyone, agree or disagree. Dots on the right split the participants.",
  divisiveHow: "Hover or tap a dot to read the statement. Start at the far right for the most divisive one.",
  axisConsensus: "Consensus",
  axisDivisive: "Divisive",
  pickADot: "Tap a dot to see the statement here.",

  majority: "Majority",
  majorityIntro: "What most people agreed or disagreed with.",
  majorityRule:
    "At least {pct}% of all participants voted the same way on these statements, even if a smaller group voted the other way.",
  majorityNone: "No statement has reached a {pct}% majority yet.",

  groups: "Opinion groups",
  groupsIntro:
    "Across {n} grouped participants, {k} opinion groups emerged. A group is a set of participants who voted alike on many statements, and differently from the other groups.",
  groupHeading: "{name}: {n} participants",
  groupIntro: "The statements that set this group apart, by their votes:",
  groupDefault: "Group {letter}",
  metadata: "Metadata",
  metadataIntro:
    "How each group answered the statements that moderators marked as metadata (self-reported characteristics).",

  uncertainty: "Areas of uncertainty",
  uncertaintyIntro:
    "Across all {n} participants, more than {pct}% of those who saw these statements passed. Uncertainty points to where the community wants more information or dialogue.",
  uncertaintyNone: "No statement had more than {pct}% passes.",

  map: "Opinion map",
  mapIntro:
    "Statements that were voted on similarly sit close together. Participants sit close to the statements they agreed with and far from those they disagreed with, so people who voted alike end up near each other.",
  mapHint: "Tap a statement number on the map to see its votes here.",
  toggleAxes: "Axes",
  toggleRadial: "Radial axes",
  toggleStatements: "Statements",
  toggleParticipants: "Participants",
  toggleOutline: "Group outlines",
  toggleLabels: "Group labels",

  all: "All statements",
  allIntro: "Every statement that was not moderated out, with the votes of each group.",
  sortBy: "Sort by",
  sortTid: "Statement number",
  sortConsensus: "Group-informed consensus",
  sortVotes: "Number of votes",
  sortAgreed: "% agreed",
  sortDisagreed: "% disagreed",
  sortPassed: "% passed",

  colAll: "All",
  colStatement: "Statement",
  legendAgree: "Agreed",
  legendDisagree: "Disagreed",
  legendPass: "Passed",
  legendNoVote: "Did not see it",
  members: "{n} participants",
  barTitle: "{a}% agreed, {d}% disagreed, {p}% passed, of the {s} who saw it ({seen}% of the {n} in this column).",
  missingCounts: "No vote counts",

  privacy: "Privacy",
  tos: "Terms",
};

const it = {
  report: "Rapporto",
  openConversation: "Apri la conversazione",
  autoRefresh: "Aggiornamento automatico",
  colorBlind: "Palette per daltonici",
  loading: "Caricamento del rapporto…",
  errorTitle: "Impossibile caricare il rapporto",
  errorHttp: "Il server ha risposto {status}.",
  errorHint403: "Potrebbe essere necessario accedere come organizzatore di questa conversazione.",
  errorHint404: "Questo identificativo di rapporto non esiste.",
  errorOther: "Qualcosa è andato storto durante il caricamento: {error}",
  nothingTitle: "Ancora niente da mostrare",
  nothingText:
    "Il rapporto compare quando la conversazione ha delle affermazioni e almeno sette partecipanti hanno votato. Torna dopo qualche voto in più, o attiva l’aggiornamento automatico.",
  navOverview: "Panoramica",
  navDivisive: "Divisività",
  navMajority: "Maggioranza",
  navGroups: "Gruppi",
  navUncertainty: "Incertezza",
  navMap: "Mappa",
  navAll: "Tutte le affermazioni",

  overview: "Panoramica",
  overviewIntro:
    "I partecipanti votano d’accordo, in disaccordo o passano su affermazioni brevi, e possono scriverne di proprie. Dai voti, chi ha votato in modo simile viene raggruppato in gruppi di opinione. Questo rapporto mostra su cosa tutti concordano, dove i gruppi divergono e dove le persone erano incerte.",
  runBy: "Questa conversazione è stata condotta da {owner}.",
  topicWas: "Il tema era “{topic}”.",
  statVoters: "votanti",
  statGrouped: "votanti in un gruppo di opinione",
  statVotes: "voti espressi",
  statStatements: "affermazioni",
  statVotesPerVoter: "voti per votante in media",
  statStatementsPerAuthor: "affermazioni per autore in media",

  divisive: "Quanto è stata divisiva la conversazione?",
  divisiveIntro:
    "Ogni punto è un’affermazione. I punti a sinistra hanno ricevuto lo stesso voto da quasi tutti, d’accordo o in disaccordo. I punti a destra hanno diviso i partecipanti.",
  divisiveHow: "Passa o tocca un punto per leggere l’affermazione. Parti dall’estrema destra per la più divisiva.",
  axisConsensus: "Consenso",
  axisDivisive: "Divisive",
  pickADot: "Tocca un punto per vedere qui l’affermazione.",

  majority: "Maggioranza",
  majorityIntro: "Su cosa la maggior parte delle persone era d’accordo o in disaccordo.",
  majorityRule:
    "Almeno il {pct}% di tutti i partecipanti ha votato allo stesso modo su queste affermazioni, anche se un gruppo più piccolo ha votato in modo opposto.",
  majorityNone: "Nessuna affermazione ha ancora raggiunto una maggioranza del {pct}%.",

  groups: "Gruppi di opinione",
  groupsIntro:
    "Tra {n} partecipanti raggruppati sono emersi {k} gruppi di opinione. Un gruppo è un insieme di partecipanti che hanno votato in modo simile su molte affermazioni, e in modo diverso dagli altri gruppi.",
  groupHeading: "{name}: {n} partecipanti",
  groupIntro: "Le affermazioni che distinguono questo gruppo, per i suoi voti:",
  groupDefault: "Gruppo {letter}",
  metadata: "Metadati",
  metadataIntro:
    "Come ogni gruppo ha risposto alle affermazioni che i moderatori hanno segnato come metadati (caratteristiche auto-dichiarate).",

  uncertainty: "Aree di incertezza",
  uncertaintyIntro:
    "Tra tutti i {n} partecipanti, più del {pct}% di chi ha visto queste affermazioni ha passato. L’incertezza indica dove la comunità vuole più informazioni o dialogo.",
  uncertaintyNone: "Nessuna affermazione ha avuto più del {pct}% di passaggi.",

  map: "Mappa delle opinioni",
  mapIntro:
    "Le affermazioni votate in modo simile stanno vicine. I partecipanti stanno vicini alle affermazioni con cui erano d’accordo e lontani da quelle con cui erano in disaccordo, così chi ha votato in modo simile finisce vicino.",
  mapHint: "Tocca il numero di un’affermazione sulla mappa per vederne qui i voti.",
  toggleAxes: "Assi",
  toggleRadial: "Assi radiali",
  toggleStatements: "Affermazioni",
  toggleParticipants: "Partecipanti",
  toggleOutline: "Contorni dei gruppi",
  toggleLabels: "Etichette dei gruppi",

  all: "Tutte le affermazioni",
  allIntro: "Ogni affermazione non esclusa dalla moderazione, con i voti di ciascun gruppo.",
  sortBy: "Ordina per",
  sortTid: "Numero dell’affermazione",
  sortConsensus: "Consenso tra i gruppi",
  sortVotes: "Numero di voti",
  sortAgreed: "% d’accordo",
  sortDisagreed: "% in disaccordo",
  sortPassed: "% passati",

  colAll: "Tutti",
  colStatement: "Affermazione",
  legendAgree: "D’accordo",
  legendDisagree: "In disaccordo",
  legendPass: "Passato",
  legendNoVote: "Non l’ha vista",
  members: "{n} partecipanti",
  barTitle: "{a}% d’accordo, {d}% in disaccordo, {p}% passato, tra i {s} che l’hanno vista ({seen}% dei {n} di questa colonna).",
  missingCounts: "Nessun conteggio",

  privacy: "Privacy",
  tos: "Termini",
};

export function pickLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (q === "it" || q === "en") return q;
    const nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("it") === 0) return "it";
  } catch (e) {
    // no window: English
  }
  return "en";
}

export const lang = pickLang();
const table = lang === "it" ? it : en;

export function t(key) {
  return table[key] !== undefined ? table[key] : en[key] !== undefined ? en[key] : key;
}

export function fmt(key, vars) {
  let s = t(key);
  Object.keys(vars || {}).forEach((k) => {
    s = s.split("{" + k + "}").join(String(vars[k]));
  });
  return s;
}
