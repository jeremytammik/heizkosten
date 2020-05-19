// jtformgen.js
//
// jeremy's form generator
//
// Copyright 2020 by Jeremy Tammik.

const shead = '\
<head>\
	<meta charset="utf-8" />\
	<title>Edit Person Data</title>\
  <style>\
    body, td, label { font-family: sans-serif; font-size: small }\
    td { text-align: right }\
    table { border: 1px solid black }\
  </style>\
</head>\
';

function success_with_document_count( n, thing )
{
  var s = (1==n) ? '' : 's';
  return shead + '<body><p>Hat geklappt, vielen Dank. '
    + `Database now contains ${n} ${thing}${s}.</p>`
    + '<p><a href="/hauskosten.html">Weiter Hauskosten erfassen...</a></p>'
    + '</body>';
}

function jtformgen_confirm_delete( description, id )
{
  s1 = '<body>'
    + '<p>Sollen die Daten der folgenden Person wirklich geloescht werden?</p>'
    + `<ul><li>${description}</li></ul>`
    + `<button><a href="/person/${id}/del_confirmed">Ja</a></button> &ndash; `
    + '<button><a href="/hauskosten.html">Nein</a></button></body>';
    
  return shead + s1;    
}

function jtformgen_list_documents( thing, docs )
{
  var a = [];
  docs.forEach( (d) => { a.push(
    '<li>' + d.get_display_string()
    + ` &ndash; <a href="/${thing}/${d._id}/edit">edit</a>`
    + ` &ndash; <a href="/${thing}/${d._id}/dupl">dupl</a>`
    + ` &ndash; <a href="/${thing}/${d._id}/del">del</a></li>` );
  });
  var n = a.length.toString();
  var s = (1==n) ? '' : 's';
  var s1 = `<body><p>${n} ${thing}${s}:</p><ul>`;
  var s2 =  a.join('\n');
  var s3 = '</ul><p><a href="/hauskosten.html">return to hauskosten</a></p></body>';

  return shead + s1 + s2 + s3;
}

function jtformgen_edit_for_strings( p, id, url_action, verb, error )
{
  //console.log('err', error);
  var errlist = [];
  if( error ) {
    var n = Object.keys( error.errors ).length;
    var s = (1==n) ? '' : 's';
    errlist.push( `${n} error${s}:<ul>` );
    for (const [key, value] of Object.entries(error.errors)) {
      errlist.push( `<li>${value.path}: ${value.message}</li>` );
    }
    errlist.push( `</ul>` );
  }
  var serr = errlist.join('\n');

  var s1 = `
<body>\
  <p>Person ${verb}:</p>${serr}\
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
            <button type="submit">Speichern</button>\
          </td>\
        </tr>\
      </table>\
    </form>\
  </body>\
</html>\
';

return shead + s1 + s2 + s3;
}

module.exports = {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents,
  jtformgen_edit_for_strings
};
