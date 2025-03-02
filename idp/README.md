# Testdata in de IDP
De IDP in `docker-compose.yml` is zo geconfigureerd dat hij automatisch bij het starten een testconfiguratie inlaadt. Deze houdt in:
* Een realm `student` die de IDP voor leerlingen representeert.
  * Hierin de gebruiker met username `testleerling1`, wachtwoord `password`.
* Een realm `teacher` die de IDP voor leerkrachten representeert.
  * Hierin de gebruiker met username `testleerkracht1`, wachtwoord `password`.
* De admin-account (in de realm `master`) heeft username `admin` en wachtwoord `admin`.
