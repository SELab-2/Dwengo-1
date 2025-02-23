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

We zullen (verzachte versie van) [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) gebruiken.
Lees [hier](TODO-wiki) meer over deze beslissing.

Concreet betekent dit dat het project uit de volgende branches bestaat:

- `main`
    - Incl. tags (`v1.2.3`)
- `dev`
    - `feat/my-feat`: Voor features die uit geen of meer dan 1 issue bestaan
    - `feat/this-#x`: Voor features die aan een issue gelinkt kunnen worden
    - `fix/something-#x`: Voor (minder dringende) bug fixes. Bug fixes worden aan een issue gelinkt.
- `release/x.y.z`: Release prep branch

## Coding conventions

- Formatting: [Prettier](https://prettier.io/)
- Linting: Maak gebruik van [ESLint](https://typescript-eslint.io/) of aan de hand van de [
  `npm` commando's](package.json).

Voel je vrij om zelf commit hooks te installeren, maar we dwingen dit niet af.

## Commits

Om de geschiedenis van het project overzichtelijk te houden, maken we gebruik van [conventional commits](https://www.conventionalcommits.org/).


Concreet

Dit betekent dat elke commit een duidelijke boodschap moet hebben, die volgens een bepaald formaat is opgesteld.

Maken gebruik van [conventional commits](https://www.conventionalcommits.org/)

Lees [hier](wiki) meer over deze beslissing

Concreet:

```
<type>(<optional scope>): <description>

type options:
    feat, fix, refactor, test, docs, build, ci, chore, ...
```

Als je een commit 'fixt', gebruik dan [
`git commit --fixup`](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt)

Als je een commit niet alleen hebt geschreven, maak dan een [commit met meerdere auteurs](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors).

## Pull request

Eens je code hebt geschreven en gecommit, is het tijd om een pull request te maken.
Het is fijn als je meteen ([draft](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests)) pull requests maakt, zodat anderen kunnen meekijken en feedback kunnen geven.

Als je aan visuele features werkt, voeg dan een screenshot van de omgeving van de feature toe, voor en nadat de feature
geïmplementeerd werd.

Je zult merken dat sommige branches [beschermd](https://docs.github.com/en/github/administering-a-repository/about-protected-branches) zijn.
Dit betekent dat je niet zomaar kan mergen naar deze branches:

- naar `main`: kan enkel vanuit `release/x.y.z`
- naar `dev`: wordt nagekeken alvorens te mergen
- elders: vrije keuze
