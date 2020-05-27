// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
//const date_time_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const date_with_optional_time_format = /^\d{4}-\d{2}-\d{2}[T\d\:\.Z]*$/;

const non_empty_alpha_mumeric = /^[0-9a-zA-Z\_]+$/;
const empty_or_ascii_or_umlaut = /^[0-9a-zA-Zäöü\ \:\;\.\,\-\+\_\@]*$/;

// used in model/person

const regex_valid_person_id = /^[0-9a-z_]{1,20}$/; // non-empty lowercase alphanumeric with underscore max 20 length
const regex_valid_unit_list = /^[0-9,]{3,40}$/; // comma-separated digits only, min 3 max 40 length
const regex_valid_name_chars = /^[äöü\w][äöü\w\ ]*$/;
const regex_valid_email_address = /^[äöü\w_.+\-]+@[äöü\w\-]+\.[äöü\w\-\.]+$/;
const regex_valid_iban = /^([a-zA-Z]{2})(\d{2})([a-zA-Z\d ]+)$/;
const regex_valid_telephone_number = /^[0-9\+][0-9\/\- ]{4,20}$/;
const regex_valid_apartment_id = /^[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
const regex_valid_unit_id = /^[0-9]{3}$/;
const regex_valid_meter_id = /^(?:RA|HE|KW|WW)-(?:KU|BA|FL|SK|SM|SG|WO)-[0-9\-]{1,12}$/;
const regex_valid_date = /^(?:19|20)[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
const regex_valid_meter_expiry_with_factor = /^(?:19|20)[0-9]{2}-[0-9]{2}-[0-9]{2}\ *\,\ *[0-9\.]{1,7}$/;

//const regex_empty_or_alnum_or_umlaut_with_space = /^[0-9a-zA-Zäöü\-\ ]*$/;
//const regex_empty_or_ascii_or_umlaut = /^[0-9a-zA-Zäöü\ \;\.\,\-\+\_\@]*$/;

module.exports = {
  date_with_optional_time_format,
  non_empty_alpha_mumeric,
  empty_or_ascii_or_umlaut,
  
  regex_valid_person_id,
  regex_valid_unit_list,
  regex_valid_name_chars,
  regex_valid_email_address,
  regex_valid_iban,
  regex_valid_telephone_number,
  regex_valid_apartment_id,
  regex_valid_unit_id,
  regex_valid_meter_id,
  regex_valid_date,
  regex_valid_meter_expiry_with_factor
};
