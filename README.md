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
Installer CUPS:
* `sudo apt-get install cups`

Installer driver for skriveren:
* Se [sewoocupsinstall_arm](sewoocupsinstall_arm)-mappen
