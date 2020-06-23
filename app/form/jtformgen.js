// jtformgen.js
//
// jeremy's form generator
//
// Copyright 2020 by Jeremy Tammik.

const util = require( '../calc/util' );

const input_attributes_string = 'type="string" maxlength="40" size="33"';
const input_attributes_number = 'type="number" min="0" max="1200000" maxlength="9" size="12" step="any"';
const input_attributes_meter = 'type="string" maxlength="100" size="15"';

const shead = '\
<head>\
	<meta charset="utf-8" />\
	<title>Herucoal</title>\
  <link rel="stylesheet" type="text/css" href="/css/herucoal.css">\
</head>\
';

function wrap_html(s)
{
  return shead + `<body>\n${s}\n</body></html>`;
}

function success_with_document_count( msg, n, thing_en )
{
  var msg = msg ? msg : 'Hat geklappt, vielen Dank.';
  var s = (1==n) ? '' : 's';
  return wrap_html( `<p>${msg}</p>`
    + `<p>Database now contains ${n} ${thing_en}${s}.</p>`
    + '<p><a href="/index.html">Weitere Daten erfassen...</a></p>' );
}

function jtformgen_confirm_delete( model, description, id )
{
  var route = model.route;
  var thing_de = model.thing_de;
  return wrap_html( '<body>'
    + `<p>Sollen die Daten der folgenden ${thing_de} wirklich geloescht werden?</p>`
    + `<ul><li>${description}</li></ul>`
    + `<button><a href="/${route}/${id}/del_confirmed">Ja</a></button> &nbsp; `
    + '<button><a href="/index.html">Nein</a></button></body>' );
}

function jtformgen_list_documents( model, where, docs, enable_select, enable_dupl_del, url_filter, sfilter )
{
  var ssearch = url_filter ? `\
<form action="${url_filter}" method="POST">\
<button type="submit" style="border: 0; background: transparent">\
  <img src="/img/filter.png" alt="Filter" /></button>\
<input type="string" maxlength="40" size="20" id="filter" name="filter"\
  placeholder="Filtersuchbegriff" value="${sfilter?sfilter:''}"></input>\
</form>\
` : ''; 
  
  var route = model.route;
  var thing = model.thing_en;
  
  var a = [];
  docs.forEach( (d) => {
    a.push( d.get_display_string() + '+++' + d._id );
  });
  a.sort();
  
  b = [];
  a.forEach( (s) => {
    var [ds,id] = s.split( '+++' );
    var action_view = `<a href="/${route}/${id}"><img src="/img/view.png"/></a>`
    var action_select_or_edit = enable_select
      ? `<a href="/${route}/${id}/select"><img src="/img/select.png"/></a>`
      : `<a href="/${route}/${id}/edit"><img src="/img/edit.png"/></a>&nbsp;`;
    var action_dupl_and_del = enable_dupl_del
      ? `<a href="/${route}/${id}/dupl"><img src="/img/dupl.png"/></a>&nbsp;`
      + `<a href="/${route}/${id}/del"><img src="/img/del.png"/></a>`
      : '';
    b.push( `<li>${action_view} ${action_select_or_edit} ${action_dupl_and_del} ${ds}</li>` );
  });
  
  var n = b.length.toString();
  var s = (1==n) ? '' : 's';
  var s1 = `<p>${n} ${thing}${s}${where}:</p><ul class="actions">`;
  var s2 =  b.join('\n');
  var s3 = '</ul><p><a href="/index.html">return to hauskosten</a></p>';

  return wrap_html( ssearch + s1 + s2 + s3 );
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

function create_editor_for_obj( k, o )
{
  a = [`<tr><td class="right"><label for="${k}">${k}:</label></td>`];
  var i = 0;
  for( var key in o ) {
    if( o.hasOwnProperty( key ) ) {
      var trtd = (0 < i) ? '<tr><td></td>' : ''; // skip initial tr td tags on first
      a.push( `${trtd}\
<td><input ${input_attributes_meter} id="${k}_${i}_key" name="${k}_${i}_key" value="${key}">\
&nbsp;<input ${input_attributes_meter} id="${k}_${i}_val" name="${k}_${i}_val" value="${o[key]}"></td>\
</tr>` );
      ++i;
    }
  }
  // add count of entries:
  a[0] = `<tr><td class="right"><label for="${k}">${i} ${k}:</label></td>`;
  return a.join('\n');
}

function jtformgen_edit_document( p, url_action, verb, for_string, error )
{
  var is_view = !(url_action.includes('_submit'));
  
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

  var method = is_view ? 'GET' : 'POST';
  var url_action = is_view ? '/' : url_action;
  var send = is_view ? 'Home' : 'Speichern';
  
  var s1 = `
  <p>${verb}:</p>${serr}\
  <form action="${url_action}" method="${method}">\
    <table>\
`;

var input_attributes = for_string
  ? input_attributes_string
  : input_attributes_number;

var a = [];
Object.keys(p).forEach( (key,index) => {
  var k = key;
  var v = p[key];
  
  //console.log( 'key', k, 'value type is', typeof v, v.constructor.name, Object.prototype.toString.call(v) );
  
  if( v && v.constructor && ('Date' === v.constructor.name) ) {
    v = util.jtisodate( v );
  }
  
  var editor = (v && v.constructor && ('Object' === v.constructor.name) ) // MongooseMap
    ? create_editor_for_obj( k, v )
    : `\ 
<td class="right"><label for="${k}">${k}:</label></td>\
<td><input ${input_attributes} placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
`;

  a.push( `<tr>${editor}</tr>`);
});

var s2 = a.join('\n');

var s3 = `\
        <tr>\
          <td colspan="2" style="text-align: center">\
            <button type="submit">${send}</button>\
          </td>\
        </tr>\
      </table>\
    </form>`;

return wrap_html( s1 + s2 + s3 );
}

//function nkabrechnung_report_html()

module.exports = {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents,
  jtformgen_unit_selected,
  jtformgen_edit_document
};
