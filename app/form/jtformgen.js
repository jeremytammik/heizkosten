// jtformgen.js
//
// jeremy's form generator
//
// Copyright 2020 by Jeremy Tammik.

function jt_form_generator_for_strings( p, id, url_action, verb )
{
  var s1 = `\
<head>\
	<meta charset="utf-8" />\
	<title>Edit Person Data</title>\
  <style>\
    body, td, label { font-family: sans-serif; font-size: small }\
    td { text-align: right }\
    table { border: 1px solid black }\
  </style>\
</head>\
\
<body>\
  <p>Person ${verb}:</p>\
  <form action="/person/${id}/${url_action}_submit" method="POST">\
    <table>\
`;

var a = [];
Object.keys(p).forEach( (key,index) => {
  var k = key;
  var v = p[key];
  a.push( `\ 
<tr>\
<td><label for="${k}">${k}:</label></td>\
<td><input type="string" maxlength="30" size="30" placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
</tr>\
` );
});

var s2 = a.join('\n');

var s3 = '\
        <tr>\
          <td colspan="2" style="text-align: center">\
            <button onclick="history.back()">Abbruch und zurueck</button>\
            <button type="submit">Speichern</button>\
          </td>\
        </tr>\
      </table>\
    </form>\
  </body>\
</html>\
';

return s1 + s2 + s3;
}

module.exports = {
  jt_form_generator_for_strings
};
