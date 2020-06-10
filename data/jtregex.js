const jtregex = {

// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
//const date_time_format: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
date_with_optional_time_format: /^\d{4}-\d{2}-\d{2}[T\d\:\.Z]*$/,

non_empty_alpha_mumeric: /^[0-9a-zA-Z\_]+$/,
empty_or_ascii_or_umlaut: /^[0-9a-zA-Zäöü\ \:\;\.\,\-\+\_\@\&\*]*$/,

valid_person_id: /^[0-9a-z_]{1,30}$/, // non-empty lowercase alphanumeric with underscore max 30 length
valid_unit_list: /^[0-9,]{3,40}$/, // comma-separated digits only, min 3 max 40 length
valid_name_chars: /^\*?[äöü\w][äöü\w\ \&\-\.]*\*?$/,
valid_email_address: /^[äöü\w_.+\-]+@[äöü\w\-]+\.[äöü\w\-\.]+$/,
valid_iban: /^([a-zA-Z]{2})(\d{2})([a-zA-Z\d ]+)$/,
//valid_telephone_number: /^[0-9\+][0-9\/\- ]{4,20}$/,
valid_telephone_numbers: /^[0-9\+][0-9\/\- \,\+]{4,60}$/,
valid_apartment_id: /^[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
valid_contract_id: /^[0-9]{3}-[0-9]{2}-[0-9]{2}-[0-9]{2,4}$/,
valid_unit_id: /^[0-9]{3}$/,
valid_meter_id: /^(?:RA|HE|KW|WW)-(?:KU|BA|FL|SK|SM|SG|WO)-[0-9\-]{1,12}$/,
valid_meter_nr: /^[0-9]{1,12}$/,
valid_date: /^(?:19|20)[0-9]{2}-[0-9]{2}-[0-9]{2}$/,
valid_meter_expiry_with_factor: /^(?:19|20)[0-9]{2}-[0-9]{2}-[0-9]{2}\ *\,\ *[0-9\.]{1,7}$/

//empty_or_alnum_or_umlaut_with_space: /^[0-9a-zA-Zäöü\-\ ]*$/,
//empty_or_ascii_or_umlaut: /^[0-9a-zA-Zäöü\ \;\.\,\-\+\_\@]*$/
}

module.exports = jtregex;
