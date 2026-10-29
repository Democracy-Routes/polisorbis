import { Operator, Var, AiNote, operator } from '../components/landers/legal-bits'

# Informativa sulla privacy

Questa informativa spiega che cosa questa installazione di Polis registra su di te, perché, e che cosa puoi fare al riguardo. È scritta a partire da ciò che il software fa davvero; il titolare indicato sotto è responsabile di questa installazione. È una descrizione, non una consulenza legale.

## Chi gestisce questo servizio

<Operator lang="it" />

## Che cosa viene conservato

**Se partecipi a una conversazione** (voti le affermazioni o ne scrivi una):

- Un identificativo casuale, conservato in un cookie nel tuo browser, perché i tuoi voti siano contati una sola volta e non ti venga mostrata due volte la stessa affermazione. Non è collegato al tuo nome, e il nome non ti viene mai chiesto.
- Ogni voto che esprimi (d'accordo, contrario o passo) su ogni affermazione, con l'ora.
- Le affermazioni che scrivi, con l'ora. Le affermazioni sono pubbliche: l'organizzatore le rivede e gli altri partecipanti le votano.
- L'indirizzo della pagina web da cui hai aperto la conversazione, quando è incorporata in un altro sito.
- Nessun dato di posizione: il software può ricavare una posizione dal tuo indirizzo di rete, ma questa funzione è disattivata su questa installazione.

**Se hai un account da organizzatore** (crei conversazioni):

- Un nome visualizzato, l'hash della password e un hash unidirezionale del tuo indirizzo email. L'indirizzo stesso non viene mai conservato, e questo servizio non invia email.
- Le conversazioni che crei: titolo, descrizione, impostazioni e affermazioni.

**Log del server.** Il server web registra nei suoi file di log l'indirizzo di rete di ogni richiesta, con l'ora e la pagina richiesta. Servono solo per la sicurezza e la risoluzione di problemi e vengono cancellati secondo la rotazione dei log del titolare.

## Perché, e su quale base

I dati sopra servono a far funzionare la consultazione: contare i voti, mostrare a ogni partecipante le affermazioni che non ha ancora visto e calcolare quali affermazioni trovano accordo tra i gruppi di partecipanti. I gruppi di opinione mostrati nei risultati sono calcolati solo dai voti.

I voti su affermazioni che riguardano questioni pubbliche possono rivelare opinioni politiche. La partecipazione è volontaria e anonima; votando dopo aver letto questa informativa acconsenti a questo trattamento. Se non vuoi che i tuoi voti siano registrati, non votare.

## Che cosa esce da questo server

Niente, per impostazione predefinita. Questa installazione non carica script, font o immagini da altre aziende, non usa strumenti di analisi del traffico e non invia email.

<AiNote lang="it" />

## Cookie

Vengono impostati solo i cookie necessari al funzionamento del servizio; non c'è un banner di consenso perché non c'è nulla di facoltativo a cui acconsentire:

- `pc`: l'identificativo casuale del partecipante descritto sopra (un anno).
- `token2`, `uid2`, `e`, `uc`: la sessione di un organizzatore che ha effettuato l'accesso.
- `ct`, `tryCookie`: una verifica che i cookie funzionino, necessaria quando la conversazione è incorporata in un altro sito.

## Per quanto tempo

Voti e affermazioni sono conservati finché esiste la conversazione, e al massimo <Var name="retention" lang="it" />. Il titolare può chiudere una conversazione, il che blocca nuovi voti, oppure cancellarla. I log del server seguono la rotazione dei log del titolare.

## I tuoi diritti

Ai sensi del Regolamento generale sulla protezione dei dati puoi chiedere al titolare l'accesso ai dati che ti riguardano, la loro rettifica o cancellazione, la limitazione del trattamento o l'opposizione, e di riceverli in un formato portabile. Poiché la partecipazione è anonima, il titolare può individuare i tuoi voti solo se gli comunichi il valore del tuo cookie `pc`. Scrivi al contatto indicato sopra. Puoi anche presentare reclamo a un'autorità di controllo, in particolare <Var name="authority" lang="it" />.

## Dove sono i dati

Questa installazione è ospitata in <Var name="country" lang="it" />. I dati non vengono trasferiti fuori dall'Unione Europea, salvo al fornitore di intelligenza artificiale indicato sopra quando quella funzione è attiva e il fornitore si trova fuori dall'UE.

## Il software

Questo servizio usa software libero con licenza GNU Affero General Public License. Il codice sorgente è disponibile su <a href={operator.repo}>{operator.repo}</a>.
