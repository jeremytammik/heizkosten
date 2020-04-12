// apartment.js
//
// mongo data model definition for a heizkosten apartment
//
// Copyright 2020 by Jeremy Tammik.

var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;

/*
id_wohnung
  energieerfassung
    eigentuemer
    qm
    anzahl zimmer
    rauchmelder (ablaufdatum) -- smokedetector
    wasseruhren (nummer, ablaufdatum) -- watermeter
    heizkostenverteiler (nummer, ablaufdatum, faktor) -- heatcostallocator
  andere rechnungen
    verwaltergebuehr
    grundsteuer
  zimmerkuerzel: BA bad, FL flur, KU kueche, SK, SM, SG schlaf klein, mittel und gross
  nebenkosten_anteil_schluessel is more or less the total unit living area divided by the apartment area m2
*/

var apartmentSchema = new Schema({
  apartment_id: String,
  owner_id: ObjectId,
  grundbuchnr: String,
  area_m2: Number,
  room_count: Number,
  smokedetectors: [{ idnr: String, expires: Date }],
  coldwatermeters: [{ idnr: String, expires: Date }],
  warmwatermeters: [{ idnr: String, expires: Date }],
  heatcostallocators: [{ idnr: String, expires: Date, factor: Number }],
  management_cost_eur: Number,
  heating_electrity_cost_eur: Number,
  landtax_eur: Number,
  nebenkosten_anteil_schluessel: Number 
});

mongoose.model( 'apartment', apartmentSchema );

/*
sample_apartment_1_zwei_zimmer = {
  "apartment_id": "001-09-02",
  "owner_id": ObjectId,
  "grundbuchnr": "grundbuchnr_001-09-02",
  "area_m2": 66.80,
  "room_count": 2,
  "smokedetectors": [{ "idnr": "001-09-02-FL", "expires": 2020-12-31 }, { "idnr": "001-09-02-SM", "expires": 2020-12-31 }],
  "coldwatermeters": [{ "idnr": "1425007-BA", "expires": 2020-12-31 }],
  "warmwatermeters": [{ "idnr": "4133075-BA", "expires": 2020-12-31 }],
  "heatcostallocators": [{ "idnr": "44318710-WO", "expires": 2020-12-31, "factor": 1.15 }, { "idnr": "44318734-BA", "expires": 2020-12-31, "factor": 0.325 }, { "idnr": "44318741-SM", "expires": 2020-12-31, "factor": 0.9 }, { "idnr": "44318727-KU", "expires": 2020-12-31, "factor": 0.375 }],
  "management_cost_eur": 0,
  "heating_electrity_cost_eur": 0,
  "landtax_eur": 0,
  "nebenkosten_anteil_schluessel": 0.0082
};

sample_apartment_2_drei_zimmer_klein = {
  "apartment_id": "001-05-03",
  "owner_id": ObjectId,
  "grundbuchnr": "grundbuchnr_001-05-03",
  "area_m2": 86.49,
  "room_count": 3,
  "smokedetectors": [{ "idnr": "001-05-03-FL", "expires": 2020-12-31 }, { "idnr": "001-05-03-SM", "expires": 2020-12-31 }, { "idnr": "001-05-03-SK", "expires": 2020-12-31 }],
  "coldwatermeters": [{ "idnr": "4169100-BA", "expires": 2020-12-31 }, { "idnr": "524401116-KU", "expires": 2020-12-31 }],
  "warmwatermeters": [{ "idnr": "4133127-BA", "expires": 2020-12-31 }, { "idnr": "525625030-KU", "expires": 2020-12-31 }],
  "heatcostallocators": [{ "idnr": "44333607-WO", "expires": 2020-12-31, "factor": 1.35 }, { "idnr": "44333614-BA", "expires": 2020-12-31, "factor": 0.3 }, { "idnr": "44333621-SM", "expires": 2020-12-31, "factor": 0.875 }, { "idnr": "44333638-SK", "expires": 2020-12-31, "factor": 0.575 }, { "idnr": "44333843-KU", "expires": 2020-12-31, "factor": 0.575 }],
  "management_cost_eur": 0,
  "heating_electrity_cost_eur": 0,
  "landtax_eur": 0,
  "nebenkosten_anteil_schluessel": 0.0108
};

sample_apartment_3_drei_zimmer_gross_mieter_wechsel_2019 = {
  "apartment_id": "001-14-05",
  "owner_id": ObjectId,
  "grundbuchnr": "grundbuchnr_001-14-05",
  "area_m2": 88.95,
  "room_count": 3,
  "smokedetectors": [{ "idnr": "001-14-05-FL", "expires": 2020-12-31 }, { "idnr": "001-14-05-SM", "expires": 2020-12-31 }, { "idnr": "001-14-05-SK", "expires": 2020-12-31 }],
  "coldwatermeters": [{ "idnr": "4007049-BA", "expires": 2020-12-31 }, { "idnr": "52440355-KU", "expires": 2020-12-31 }],
  "warmwatermeters": [{ "idnr": "4133058-BA", "expires": 2020-12-31 }, { "idnr": "604465496-KU", "expires": 2020-12-31 }],
  "heatcostallocators": [{ "idnr": "44322335-WO", "expires": 2020-12-31, "factor": 1.35 }, { "idnr": "443323257-BA", "expires": 2020-12-31, "factor": 0.375 }, { "idnr": "44323240-SM", "expires": 2020-12-31, "factor": 0.975 }, { "idnr": "443323233-SK", "expires": 2020-12-31, "factor": 0.675 }, { "idnr": "44322328-KU", "expires": 2020-12-31, "factor": 0.575 }],
  "management_cost_eur": 0,
  "heating_electrity_cost_eur": 0,
  "landtax_eur": 0,
  "nebenkosten_anteil_schluessel": 0.0110
};

sample_apartment_3_drei_zimmer_gross = {
  "apartment_id": "001-12-06",
  "owner_id": ObjectId,
  "grundbuchnr": "grundbuchnr_001-12-06",
  "area_m2": 88.95,
  "room_count": 3,
  "smokedetectors": [{ "idnr": "001-12-06-FL", "expires": 2020-12-31 }, { "idnr": "001-12-06-SM", "expires": 2020-12-31 }, { "idnr": "001-12-06-SK", "expires": 2020-12-31 }],
  "coldwatermeters": [{ "idnr": "4168990-BA", "expires": 2020-12-31 }, { "idnr": "604465465-KU", "expires": 2020-12-31 }],
  "warmwatermeters": [{ "idnr": "4133078-BA", "expires": 2020-12-31 }, { "idnr": "424236221-KU", "expires": 2020-12-31 }],
  "heatcostallocators": [{ "idnr": "44322311-WO", "expires": 2020-12-31, "factor": 1.35 }, { "idnr": "551540802-BA", "expires": 2020-12-31, "factor": 0.4 }, { "idnr": "44318239-SM", "expires": 2020-12-31, "factor": 0.975 }, { "idnr": "44318222-SK", "expires": 2020-12-31, "factor": 0.575 }, { "idnr": "44318215-KU", "expires": 2020-12-31, "factor": 0.475 }],
  "management_cost_eur": 0,
  "heating_electrity_cost_eur": 0,
  "landtax_eur": 0,
  "nebenkosten_anteil_schluessel": 0.0110
};

sample_apartment_4_vier_zimmer = {
  "apartment_id": "001-01-04",
  "owner_id": ObjectId,
  "grundbuchnr": "grundbuchnr_001-01-04",
  "area_m2": 107.32,
  "room_count": 4,
  "smokedetectors": [{ "idnr": "001-01-04-FL", "expires": 2020-12-31 }, { "idnr": "001-01-04-SM", "expires": 2020-12-31 }, { "idnr": "001-01-04-SK", "expires": 2020-12-31 }, { "idnr": "001-01-04-SG", "expires": 2020-12-31 }],
  "coldwatermeters": [{ "idnr": "4169109-BA", "expires": 2020-12-31 }, { "idnr": "7278931-KU", "expires": 2020-12-31 }],
  "warmwatermeters": [{ "idnr": "4133141-BA", "expires": 2020-12-31 }, { "idnr": "525624842-KU", "expires": 2020-12-31 }],
  "heatcostallocators": [{ "idnr": "44322748-WO", "expires": 2020-12-31, "factor": 1.575 }, { "idnr": "44322786-BA", "expires": 2020-12-31, "factor": 0.45 }, { "idnr": "603023628-SM", "expires": 2020-12-31, "factor": 0.875 }, { "idnr": "44322762-SK", "expires": 2020-12-31, "factor": 0.525 }, { "idnr": "44322755-KU", "expires": 2020-12-31, "factor": 0.525 }, { "idnr": "4322793-SG", "expires": 2020-12-31, "factor": 0.875 }],
  "management_cost_eur": 0,
  "heating_electrity_cost_eur": 0,
  "landtax_eur": 0,
  "nebenkosten_anteil_schluessel": 0.0133
};

four_sample_apartments = [
  sample_apartment_1_zwei_zimmer,
  sample_apartment_2_drei_zimmer_klein,
  sample_apartment_3_drei_zimmer_gross,
  sample_apartment_4_vier_zimmer];

*/
