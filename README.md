# herucoal

Housing unit utilities &ndash; heating, hot and cold water, management, maintenance and running &ndash; cost allocation
[node.js](https://nodejs.org) app
and [mongodb](https://www.mongodb.com) database.

UIs required:

- Admin, see everything
- Consumption, meters
- Hausverwalter
- Nebenkosten (Vermieter)

## Installation

- Install [node.js](https://nodejs.org)
- Install [mongodb](https://www.mongodb.com)
  &ndash; not the cloud-hosted 'Atlas' version, but the [MongoDB Community Edition, e.g., on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x),
  which in turn requires [brew](https://brew.sh/#install).
- Download and install [Herucoal](https://github.com/jeremytammik/herucoal) &ndash; use the green button above saying 'Clone or Download' and download and unpack the zip file.
- Enter the herucoal directory, run terminal and enter `npm install`
- In the terminal in the herucoal directory, run `npm start`
- Open the URL listed in the browser

## Startup

```
mongod &
cd ~/Documents/herucoal
git pull
npm start
```

## Usage

- Load the existing data: Admin
    - Load unit data
    - Load apartment data
    - Load person data
    - Load contract data


## Data Structure

- unit &ndash; das haus oder objekt
    - address
    - manager verwalter
    - area_m2 wohnflaeche gesamt
    - apartment count anzahl wohnungen
    - splitting_factor_m2 z.b. 0.5, 0.7
    - payments zahlungen, z.b. reparaturruecklage
- apartment wohnung
    - owner besitzer
    - grundbuchnr
    - area_m2
    - room_count
    - smokedetectors rauchmelder nummer, ablaufdatum, ablesewerte
    - coldwatermeters kaltwasserzaehler nummer, ablaufdatum, ablesewerte
    - hotwatermeters warmwasserzaehler nummer, ablaufdatum, ablesewerte
    - heatcostallocators heizkostenmessgeraete nummer, ablaufdatum, faktor, ablesewerte
    - management_cost_eur verwaltungskosten
    - heating_electrity_cost_eur heizungsstrom
    - landtax_eur grundsteuer
    - nebenkosten_anteil_schluessel: 0.011
- contract vertrag
    - occupants bewohner
    - apartment 
    - begin vertragsbeginn
    - end vertragsende
    - rent_apartment_eur erwartete monatliche wohnungsmiete
    - rent_other_eur erwartete monatliche sonstige miete
    - nebenkosten_eur erwartete nebenkostenvorauszahlungen
    - deposit_eur kaution
    - payments_rent_apartment gezahlte wohnungsmiete
    - payments_rent_other gezahlte sonstige miete
    - payments_nk gezahlte nebenkostenvorauszahlungen
    - smokedetector_maintenance_cost_eur rauchmelderwartungskosten
- yearly cost jaehrliche kosten
    - hausgeld nicht umlagefaehig, zahlen eigentuemer
        - hausgeld_eur
    - hausgeld umlagefaehig, zahlen mieter
        - kabelgebuehren
    - pro quadratmeter mit nebenkosten_anteil_schluessel
        - allgemeinstrom
        - muellgebuehren_hausmeister
        - streu_und_putzmittel
        - aussenanlage_pflege
        - versicherungen
        - niederschlagswasser
        - trinkwasseruntersuchung
        - material_und_hilfsstoffe
        - reinigung
        - hausmeister_sozialabgaben
        - hausservice_fremdfirmen
        - lift_umlagefaehig
        - feuerloescher_wartung
        - wartung_eingangstueren
        - wartung_lueftungsanlage
    - gesamtkosten heizung kaltwasser warmwasser HKW (5 items):
        - fuel brennstoff
            - fuel_consumption_kwh
            - fuel_consumption_eur
        - heiznebenkosten
            - heating_nk_consumption_allocation_eur
            - heating_nk_maintenance_eur
            - heating_nk_electrity_eur
            - heating_nk_chimneysweep_eur
        - heizzusatzkosten - kosten heizgeraete
            - heating_zk_heizgeraete_eur
        - zusatzkosten warmwasser
            - hotwater_zk_eur
        - hausnebenkosten (kaltwasseraufbereitung und entsorgung) enthaelt u.a. (5 positionen):
            - house_nk_coldwater_m3
            - house_nk_coldwater_eur
            - house_nk_coldwater_equipment_eur
            - house_nk_coldwater_allocation_fee_eur
            - house_nk_coldwater_sonderkosten_eur
- person
    - firstname
    - lastname
    - email
    - iban
    - telephone
    - salutation
    - street
    - streetnr
    - zip
    - city
    - country


## Author

Jeremy Tammik, [The Building Coder](http://thebuildingcoder.typepad.com), [ADN](http://www.autodesk.com/adn) [Open](http://www.autodesk.com/adnopen), [Autodesk Inc.](http://www.autodesk.com)

## License

(C) Copyright 2020 Jeremy Tammik. All rights reserved.
Please see the [LICENSE](LICENSE) file for full details.
