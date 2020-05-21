// jtformgen.js
//
// jeremy's form generator
//
// Copyright 2020 by Jeremy Tammik.

const shead = '\
<head>\
	<meta charset="utf-8" />\
	<title>Herucoal</title>\
  <style>\
    body, td, label { font-family: sans-serif; font-size: small }\
    td { text-align: right }\
    ul.actions { list-style-type: none; margin: 0; padding: 0 } \
    table { border: 1px solid black }\
    img { height: 1.2em } \
  </style>\
</head>\
';

function wrap_html(s)
{
  return shead + `<body>\n${s}\n</body></html>`;
}

function success_with_document_count( n, thing_en )
{
  var s = (1==n) ? '' : 's';
  return wrap_html( '<p>Hat geklappt, vielen Dank. '
    + `Database now contains ${n} ${thing_en}${s}.</p>`
    + '<p><a href="/hauskosten.html">Weiter Hauskosten erfassen...</a></p>' );
}

function jtformgen_confirm_delete( model, description, id )
{
  var route = model.route;
  var thing_de = model.thing_de;
  return wrap_html( '<body>'
    + `<p>Sollen die Daten der folgenden ${thing_de} wirklich geloescht werden?</p>`
    + `<ul><li>${description}</li></ul>`
    + `<button><a href="/${route}/${id}/del_confirmed">Ja</a></button> &ndash; `
    + '<button><a href="/hauskosten.html">Nein</a></button>' );
}

function jtformgen_list_documents( model, where, docs, enable_select )
{
  var route = model.route;
  var thing = model.thing_en;
  var a = [];
  docs.forEach( (d) => {
    var actions = enable_select
      ? `<a href="/${route}/${d._id}/select"><img src="/img/select.png"/></a> &nbsp;`
      : `<a href="/${route}/${d._id}/edit"><img src="/img/edit.png"/></a> &nbsp; `
      + `<a href="/${route}/${d._id}/dupl"><img src="/img/dupl.png"/></a> &nbsp; `
      + `<a href="/${route}/${d._id}/del"><img src="/img/del.png"/></a> &nbsp;`;
    a.push( `<li>${actions} ${d.get_display_string()}</li>` );
  });
  a.sort();
  var n = a.length.toString();
  var s = (1==n) ? '' : 's';
  var s1 = `<p>${n} ${thing}${s}${where}:</p><ul class="actions">`;
  var s2 =  a.join('\n');
  var s3 = '</ul><p><a href="/hauskosten.html">return to hauskosten</a></p>';

  return wrap_html( s1 + s2 + s3 );
}

function jtformgen_unit_selected( uid )
{
  var s1 = `<p>Unit ${uid} selected.</p><ul>`
    + `<li><a href="/cost/unit/${uid}/list">yearly costs</a></li>`
    + `<li><a href="/apt/unit/${uid}/list">apartments</a></li>`
    + `<li><a href="/unit/${uid}/contract">contracts</a></li>`
    + `<li><a href="/person/unit/${uid}/list">persons</a></li>`
    + `<li><a href="/unit/${uid}/nk">nebenkosten</a></li>`
    + `<li><a href="/unit/${uid}/hv">hausverwaltung</a></li>`
    + '</li>';
  
  return wrap_html( s1 );
}

function create_editor_for_map( k, m )
{
 s = `\ 
<td><label for="${k}">${k}:</label></td>\
<td><input ${input_attributes} placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
`;

  m.forEach( function( val, key ) {
    var e = mapname + ' ' + (++i).toString() + ' ';
    d[e + keyname] = key;
    d[e + valname] = val;
  });
  delete d[mapname];
}
  
}

function jtformgen_edit_document( p, url_action, verb, for_string, error )
{
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
  <p>${verb}:</p>${serr}\
  <form action="${url_action}" method="POST">\
    <table>\
`;

var input_attributes = for_string
  ? 'type="string" maxlength="40" size="30"'
  : 'type="number" min="0" max="999999.99" maxlength="9" size="12" step="any"';

var a = [];
Object.keys(p).forEach( (key,index) => {
  var k = key;
  var v = p[key];
  console.log( 'key', k, 'value type is', typeof v, v.constructor.name, Object.prototype.toString.call(v) );
  
  var editor = ('MongooseMap' === v.constructor.name)
    ? create_editor_for_map( v )
    : `\ 
<td><label for="${k}">${k}:</label></td>\
<td><input ${input_attributes} placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
`;

  a.push( `<tr>${editor}</tr>`);
});

var s2 = a.join('\n');

var s3 = '\
        <tr>\
          <td colspan="2" style="text-align: center">\
            <button type="submit">Speichern</button>\
          </td>\
        </tr>\
      </table>\
    </form>';

return wrap_html( s1 + s2 + s3 );
}

module.exports = {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents,
  jtformgen_unit_selected,
  jtformgen_edit_document
};
