import { Operator, Var, AiNote, operator } from '../components/landers/legal-bits'

# Privacy notice

This notice explains what this Polis installation records about you, why, and what you can do about it. It is written from what the software actually does; the operator named below is responsible for this installation. It is a description, not legal advice.

## Who operates this service

<Operator lang="en" />

## What is stored

**If you take part in a conversation** (vote on statements or write one):

- A random identifier, kept in a cookie in your browser, so that your votes are counted once and you are not shown the same statement twice. It is not linked to your name, and you are never asked for one.
- Each vote you cast (agree, disagree or pass) on each statement, with the time.
- The statements you write, with the time. Statements are public: the organizer reviews them and other participants vote on them.
- The address of the web page from which you opened the conversation, when it is embedded in another site.
- No location data: the software can look up a location from your network address, but this feature is off on this installation.

**If you have an organizer account** (you create conversations):

- A display name, a password hash, and a one-way hash of your email address. The address itself is never stored, and this service sends no email.
- The conversations you create: title, description, settings and statements.

**Server logs.** The web server records the network address of every request, with the time and the page requested, in its log files. They are used for security and troubleshooting only and are deleted according to the operator's log rotation.

## Why, and on what basis

The data above is needed to run the consultation: to count votes, to show each participant the statements they have not seen, and to compute which statements find agreement across groups of participants. The opinion groups shown in the results are computed from votes only.

Votes on statements about public issues can reveal political opinions. Taking part is voluntary and anonymous; by voting after reading this notice you consent to this processing. If you do not want your votes recorded, do not vote.

## What leaves this server

Nothing, by default. This installation loads no scripts, fonts or images from other companies, uses no analytics, and sends no email.

<AiNote lang="en" />

## Cookies

Only cookies that the service needs to work are set; there is no consent banner because there is nothing optional to consent to:

- `pc`: the random participant identifier described above (one year).
- `token2`, `uid2`, `e`, `uc`: the session of a signed-in organizer.
- `ct`, `tryCookie`: a test that cookies work, needed when the conversation is embedded in another site.

## How long

Votes and statements are kept for as long as the conversation exists, and at most <Var name="retention" lang="en" />. The operator may close a conversation, which stops new votes, or delete it. Server logs follow the operator's log rotation.

## Your rights

Under the General Data Protection Regulation you can ask the operator for access to the data about you, for its correction or deletion, to restrict or object to its processing, and to receive it in a portable format. Because participation is anonymous, the operator can find your votes only if you give the value of your `pc` cookie. Write to the contact above. You can also complain to a supervisory authority, in particular <Var name="authority" lang="en" />.

## Where the data is

This installation is hosted in <Var name="country" lang="en" />. Data is not transferred outside the European Union, except to the AI provider named above when that feature is on and the provider is outside the EU.

## The software

This service runs free software under the GNU Affero General Public License. You can read the source code at <a href={operator.repo}>{operator.repo}</a>.
