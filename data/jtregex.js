// https://mariusschulz.com/blog/deserializing-json-strings-as-javascript-date-objects
//const date_time_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const date_format = /^\d{4}-\d{2}-\d{2}$/;

const non_empty_alpha_mumeric = /^[0-9a-zA-Z\_]+$/;
const empty_or_ascii_or_umlaut = /^[0-9a-zA-Zäöü\ \;\.\,\-\+\_\@]*$/;

module.exports = {
  date_format,
  non_empty_alpha_mumeric,
  empty_or_ascii_or_umlaut
};
