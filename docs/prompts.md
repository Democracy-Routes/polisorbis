---
target: 0.5.0
starting-commit: 0.4.0
---
# Prompts

### chat01 - new POST /api/v3/prune endpoint
Creare una nuova rotta POST /api/v3/prune che accetta nel parametro max-age opzionale un numero positivo che rappresenta un numero di secondi (default 172800 equivalente a 48 ore - due giorni)
La  rotta applica il seguente flusso di lavoro.
- Cancella tutte le conversazioni (di qualsiasi utente) che non sono state modificate da più di max-age secondi
- Elimina tutti gli utenti senza conversazioni creati da piu' di  max-age secondi
La rotta ritorna 200 in caso di successo o 500 in caso di errore. La rotta può essere chiamata senza controlli sull'utente: sarà protetta dietro un altro layer di API.
Considera tutti i dati nel database: proponi inoltre una migration che mantenga consistente lo stato del database dopo la cancellazione delle conversazioni e degli utenti. Concentrati sui vincoli di integrità necessari

> ## Sintesi sessione
> Ho completato l'implementazione della rotta /api/v3/prune e della relativa migrazione del database per mantenere l'integrità dei dati tramite ON DELETE CASCADE.
>
> Le modifiche includono:
>
> Migrazione del database: Aggiunto il file 000010_add_user_cascade.sql per automatizzare la pulizia dei dati correlati quando un utente viene rimosso.
> Logica di Pruning: Implementata in server.ts, permette di eliminare conversazioni non modificate e utenti inattivi/senza conversazioni.
> Registrazione Rotta: Aggiunta in app.ts con supporto per il parametro opzionale max-age.
> Test di Verifica: Creato test/prune.test.ts per validare il corretto funzionamento.
