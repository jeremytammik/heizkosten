// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
//const date_time_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const date_format = /^\d{4}-\d{2}-\d{2}$/;

const non_empty_alpha_mumeric = /^[0-9a-zA-Z\_]+$/;
const empty_or_ascii_or_umlaut = /^[0-9a-zA-Zäöü\ \;\.\,\-\+\_\@]*$/;

// used in model/person

const regex_valid_name_chars = /^[äöü\w][äöü\w\ ]*$/;
const regex_valid_email_address = /^[äöü\w_.+\-]+@[äöü\w\-]+\.[äöü\w\-\.]+$/;
const regex_valid_iban = /^([a-zA-Z]{2})(\d{2})([a-zA-Z\d ]+)$/;
const regex_valid_telephone_number = /^[0-9\+][0-9\/\- ]{4,20}$/;

//const regex_empty_or_alnum_or_umlaut_with_space = /^[0-9a-zA-Zäöü\-\ ]*$/;
//const regex_empty_or_ascii_or_umlaut = /^[0-9a-zA-Zäöü\ \;\.\,\-\+\_\@]*$/;

module.exports = {
  date_format,
  non_empty_alpha_mumeric,
  empty_or_ascii_or_umlaut,
  regex_valid_name_chars,
  regex_valid_email_address,
  regex_valid_iban,
  regex_valid_telephone_number
};
