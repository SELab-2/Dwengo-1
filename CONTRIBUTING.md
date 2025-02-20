# Hoe bijdragen aan Dwengo-1?

## Issues

Maak gebruik van de [label set](https://github.com/SELab-2/Dwengo-1/labels).

Voor bug reports:

Geef zo veel mogelijk informatie. Als er error berichten zijn, graag in tekst bijvoegen. Geen screenshots van error
messages, enkel van visuele bugs.

Ken jezelf toe aan een issue als je eraan werkt, zodat iedereen een overzicht heeft van waar aan gewerkt wordt en door
wie. Zo wordt onnodig werk vermeden.

## Workflow

We zullen [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) gebruiken

Lees [hier](wiki) meer over deze beslissing

Concreet:

- `main`
    - Incl. tags (`v1.2.3`)
- `dev`
    - `feat/my-feat`: Voor features die uit geen of meer dan 1 issue bestaan
    - `feat/this-#x`: Voor features die aan een issue gelinkt kunnen worden
    - `fix/something-#x`: Voor (minder dringende) bug fixes. Bug fixes worden aan een issue gelinkt.
- `release/x.y.z`: Release prep branch

## Commits

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

Als je een commit niet alleen hebt geschreven, maak dan
een [commit met meerdere auteurs](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors).

## Pull request...

Als je aan visuele features werkt, voeg dan een screenshot van de omgeving van de feature toe, voor en nadat de feature
geïmplementeerd werd.

Start een draft pull request vanaf je een nieuwe feature branch pusht naar de server.

Policies

- naar `main`: kan enkel vanuit `release/x.y.z`
- naar `dev`: wordt nagekeken alvorens te mergen
- elders: vrije keuze

## Coding conventions

- Formatting: [Prettier](https://prettier.io/)
- Linting: Maak gebruik van [ESLint](https://typescript-eslint.io/) of aan de hand van de [
  `npm` commando's](package.json).

Voel je vrij om zelf commit hooks te installeren, maar we dwingen dit niet af.
