# Hoe bijdragen aan Dwengo-1?

Bedankt dat je wil bijdragen aan Dwengo-1!
Hieronder vind je enkele richtlijnen om je op weg te helpen.

Over het algemeen bestaat de workflow uit de volgende stappen:

1. [Een issue aanmaken](#issues)
2. [Een branch maken](#workflow)
3. [Code schrijven](#coding-conventions)
4. [Werk committen](#commits)
5. [Een pull request maken](#pull-request)

## Issues

Als je een issue aanmaakt is het belangrijk om zo veel mogelijk (relevante) informatie te geven.
Om je op weg te helpen zijn er [templates](.github/ISSUE_TEMPLATE) voorzien.
Gebruik deze om alle nodige informatie te verzamelen.

Gebruik de juiste [labels](https://github.com/SELab-2/Dwengo-1/labels) om te helpen een onderscheid te maken tussen verschillende categorieën issues.

Ken jezelf toe aan een issue als je eraan werkt, zodat er beter een overzicht bewaard kan worden.
Op die manier vermijd je onnodig werk.

## Workflow

Dit project maakt gebruik van (een minder strenge versie van) [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).
Dat betekent dat verschillende branches een verschillende rol hebben.
Nieuwe branches worden aangemaakt vanuit `dev` en worden gemerged naar `dev`.

Een overzicht:

- `main`: Hier worden enkel de releases gemerged. Elke merge naar `main` moet een release zijn, aangeduid met een tag (`v1.2.3`).
- `dev`: Jouw branch hoort hiervan af te takken.
    - `feat/my-feat`: Voor features die uit geen of meer dan 1 issue bestaan
    - `feat/this-#x`: Voor features die aan een issue gelinkt kunnen worden
    - `fix/something-#x`: Voor (minder dringende) bug fixes. Bug fixes worden aan een issue gelinkt.
- `release/x.y.z`: Voorbereidingen voor een release. Hier worden enkel bug fixes en hotfixes gemerged.

Lees [hier](https://github.com/SELab-2/Dwengo-1/wiki/Developmentstrategie-keuzes#gitflow) meer over de beslissing om Gitflow te gebruiken.

We hebben ervoor gekozen om `main` en `dev` te beschermen.
Zie ook [pull request](#pull-request).

## Coding conventions

Om de code consistent te houden, maken dit project gebruik van enkele tools:

- Formatting: [Prettier](https://prettier.io/), zorgt ervoor dat de code consistent geformatteerd is.
- Linting: [ESLint](https://typescript-eslint.io/), zorgt er o.a. voor dat de code geen "slechte" constructies bevat.

Je kan ze handmatig uitvoeren met `npm run lint` en `npm run format`.

Deze tools worden niet standaard automatisch uitgevoerd bij een commit.
Automatisch uitvoeren bij een commit kan met [git hooks](https://git-scm.com/docs/githooks).

## Commits

**Conventionele commits**

Dit project maakt gebruik van [conventional commits](https://www.conventionalcommits.org/).

Dit betekent dat elke commit een duidelijke boodschap moet hebben, die volgens een bepaald formaat is opgesteld.
In het kort ziet dat er zo uit:

```
<type>(<optional scope>): <description>

type options:
    feat, fix, refactor, test, docs, build, ci, chore, ...
```

Lees [hier](https://github.com/SELab-2/Dwengo-1/wiki/Developmentstrategie-keuzes#conventionele-commits) meer over de beslissing om conventionele commits te gebruiken.

**Andere tips**

Als je een commit 'fixt', gebruik dan [`git commit --fixup`](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt)

Als je een commit niet alleen hebt geschreven, maak dan een [commit met meerdere auteurs](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors).

## Pull request

Eens je code hebt geschreven en gecommit, is het tijd om een pull request te maken.
Het is fijn als je meteen ([draft](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests)) pull requests maakt, zodat anderen kunnen meekijken en feedback kunnen geven.

Om je op weg te helpen is er een [template](.github/PULL_REQUEST_TEMPLATE.md) voorzien.
Door deze in te vullen, zorg je ervoor dat de reviewer een duidelijk beeld heeft van wat je hebt gedaan.

Als je aan visuele features werkt, voeg dan een screenshot van de omgeving van de feature toe, voor en na dat de feature geïmplementeerd werd.

**Branch protection**

Je zult merken dat sommige branches [beschermd](https://docs.github.com/en/github/administering-a-repository/about-protected-branches) zijn.
Dit betekent dat je niet zomaar kan mergen naar deze branches:

- `main`: kan enkel vanuit `release/x.y.z`
- `dev`: wordt nagekeken alvorens te mergen

Elders kan je vrij mergen.

Het zou kunnen dat je code bepaalde checks moet doorstaan alvorens te mergen.
Dit kan gaan van een simpele lint check tot een volledige test suite die moet slagen.
Tag gerust een maintainer als je denkt dat je code klaar is om gemerged te worden.

## Dankjewel!
