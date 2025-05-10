# dwengo-1-backend

## Project setup

```shell
npm install

# Start de nodige services voor ontwikkeling
cd ../ # Ga naar de root van de repository
docker compose up -d
```

Zet de omgevingsvariabelen in een `.env` bestand in de root van het project.
Je kan het `.env.example` bestand als template gebruiken.

### Ontwikkeling

```shell
# Omgevingsvariabelen
cp .env.development.example .env.development.local

npm run dev
```

### Tests

Voer volgend commando uit om de unit tests uit te voeren:

```
npm run test:unit
```

### Productie

```shell
# Omgevingsvariabelen
cp .env.example .env
# Configureer de .env file met de juiste waarden!
nano .env

npm run build
npm run start
```

Zie ook de [installatiehandleiding](https://github.com/SELab-2/Dwengo-1/wiki/Administrator:-Productie-omgeving).

## Keycloak configuratie

Tijdens development is het voldoende om gebruik te maken van de keycloak configuratie die automatisch ingeladen wordt.

Voor productie is het ten sterkste aangeraden om keycloak manueel te configureren.
Voor meer informatie, zie de [administrator-handleiding](https://github.com/SELab-2/Dwengo-1/wiki/Administrator:-Productie-omgeving#installatie-en-server-configuratie).
