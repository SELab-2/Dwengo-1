<h1 align="center">Dwengo-1</h1>

<p align="center">
<span><a href="https://ugentbe-my.sharepoint.com/:f:/r/personal/bart_mesuere_ugent_be/Documents/Onderwijs/SELab2/2024-2025/mappen%20studenten/groep1" alt="OneDrive">
OneDrive</a></span>
<span><a href="https://www.figma.com/files/project/339220191" alt="Figma sjabloon">
Figma</a></span>
<span><a href="https://github.com/SELab-2/Dwengo-opgave" alt="projectopgave">
Projectopgave</a></span>
</p>

<ul align="center" style="list-style-type: none">
<li>Projectleider: Fransisco Van Langenhove (<a href="https://github.com/Gabriellvl">@Gabriellvl</a>)</li>
<li>Technische lead: Tibo De Peuter (<a href="https://github.com/tdpeuter">@tdpeuter</a>)</li>
<li>Systeembeheerder: Timo De Meyst (<a href="https://github.com/kloep1">@kloep1</a>)</li>
<li>Customer relations officer: Adriaan Jacquet (<a href="https://github.com/WhisperinCheetah">@WhisperinCheetah</a>)</li>
</ul>

Dit is de monorepo voor [Dwengo-1](https://sel2-1.ugent.be), een interactief leerplatform waar leerkrachten opdrachten
en lessen kunnen samenstellen hun leerlingen en hun vooruitgang kunnen opvolgen.

## Installatie

### Quick start

1. Installeer Docker en Docker Compose op je systeem (zie [Docker](https://docs.docker.com/get-docker/) en [Docker Compose](https://docs.docker.com/compose/)).
2. Clone deze repository.
3. Voer `docker compose up` uit in de root van de repository.

```bash
docker compose version
git clone https://github.com/SELab-2/Dwengo-1.git
cd Dwengo-1
docker compose up
```

### Handmatige installatie

Zie de submappen voor de installatie-instructies van de [frontend](./frontend/README.md) en [backend](./backend/README.md).

## Architectuur

![Architectuur](./docs/architecture/schema.png)

De tech-stack bestaat uit:

- **Frontend**: TypeScript + Vue.js + Vuetify
- **Backend**: TypeScript + Node.js + Express.js + TypeORM + PostgreSQL

Voor meer informatie over de keuze van deze tech-stack, zie [designkeuzes](https://github.com/SELab-2/Dwengo-1/wiki/Design-keuzes).

## Testen
Voer volgende commando's uit om de <frontend/backend> te testen:
```
npm run test
```

## Bijdragen aan Dwengo-1

Zie [CONTRIBUTING.md](./CONTRIBUTING.md) voor meer informatie over hoe je kan bijdragen aan Dwengo-1.
