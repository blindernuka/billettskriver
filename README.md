# Billettskriver

Dette prosjektet er en del av billettsystemet til UKA på Blindern, se https://github.com/blindernuka/billett,
og har til formål å fungere som en utskriftsserver for billettsystemet.

For å skrive ut billetter fra billettsystemet på kvitteringsskriver, vil det naturlige være å koble kvitteringsskriveren
opp mot laptoppen som brukes for billettsystemet, herunder sette opp driver, printer m.v. For utskrift vil man da måtte
åpne PDF-en som genereres, endre utskriftsinnstillinger og trykke print. Dette føler vi imidlertid at blir tungvindt.

Idéen med dette prosjektet er å ha en Raspberry Pi som er koblet til kvitteringsskriveren, og som tilbyr et API
til billettsystemet for å skrive ut PDF-er. Når man da ønsker å skrive ut billetter, vil alt skje gjennom
billettsystemet, hvor man velger hvilken Raspberry Pi som skal behandle utskriften.

## Krav
* Billettsystemet må kunne opprette tilkobling direkte mot Raspberry Pi-en

## Samkobling med billettsystemet
* Dette systemet sender "ping" til billettsystemet for å annonsere seg selv
* Billettsystemet sender PDF-er til dette systemet som automatisk blir skrevet ut

## Oppsett av Raspberry Pi

### Systemavhengigheter
Installer CUPS:
* `$ sudo apt-get install cups`

Installer driver for skriveren:
* Se [sewoocupsinstall_arm](sewoocupsinstall_arm)-mappen

Sett opp printeren i CUPS. Den må ha navn `SEWOO_LKT_Series`.

Installer NodeJS:
* Finn ut fil for siste versjon for 'arm-pi' fra http://nodejs.org/dist/
```
$ mkdir /opt/node
$ cd /opt/node
$ wget http://nodejs.org/dist/v0.11.12/node-v0.11.12-linux-arm-pi.tar.gz     (NB! sjekk for siste versjon først)
$ tar zxf node-v0.11.12-linux-arm-pi.tar.gz --strip 1
$ ln -s /opt/node/bin/node /usr/local/bin/node
$ ln -s /opt/node/bin/npm /usr/local/bin/npm
```

Vi bruker OpenVPN for å sikre at man kan koble seg til systemet dersom det er på en LAN.
* Installer OpenVPN: `$ sudo apt-get install openvpn`
* Hent ned config filer fra en annen klient
* Legg til følgende et passende sted i `/etc/ifplugd/action.d/action_wpa´
```
# skip openvpn interface
if [ "${IFPLUGD_IFACE}" = "tun0" ]; then
        exit 0
fi
```
* Start OpenVPN: `$ sudo service openvpn restart`

### Applikasjon
```
$ cd app
$ npm install
$ echo 'bytt-meg-ut' >PRINTERNAME
```

### Kjøring
```
$ npm start
```
