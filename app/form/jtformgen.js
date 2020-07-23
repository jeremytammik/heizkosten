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

const pdf_template_text = '\
Basierend auf den oben angegebenen Mietvertrag erhalten Sie Ihre Nebenkostenabrechnung für das Jahr 2019. \
Die aufgeführten umlagefähigen Hauskosten werden von unseren Verwalter Fa. PS Hausverwaltung, Nansenstr. 3, 79539 Lörrach erstellt. \
Diese und die Auflistung der Kosten für die steuerlich abziehbaren haushaltsnahen Dienstleistungen finden Sie in der Anlage. \
Dort können Sie in den nächsten zwei Wochen Einsicht in die Unterlagen nehmen. Bitte vereinbaren Sie dazu einen Termin. \
Der Anteil an diesen umlagefähigen Hauskosten hängt von Ihrer Wohnungsgröße und der Mietdauer ab. \
Den entsprechenden Faktor finden Sie in der ersten Zeile der folgenden Tabelle. \
Bei kürzerer Vorauszahlungszeit reduziert sich Ihr Anteil um 1/12 pro Monat. \
Die Energiekosten werden von der Fa. Ista auf der Grundlage Ihrer Verbrauchswerte auf Wasseruhren und Heizkostenzähler errechnet. \
Die entsprechenden Ableseprotokolle können in unseren Büro eingesehen werden. \
\n\nAuf der Basis Ihrer aktuellen Nebenkosten in Zeile 6 ergibt sich eine Anpassung der Vorauszahlung. \
Die neue Vorauszahlung wird in Zeile 10 angegeben. \
Bei Nachzahlungen sind diese bis spätestens zum 30.07.2020 auf das Konto DE30 6805 2230 0000 0131 36 zu überweisen. \
Bitte passen Sie Ihren Dauerauftrag ab den 1. September 2020 an. \
Eine Erhöhung der Nebenkosten ist keine Mieterhöhung, sondern Sie gleichen damit nur aus, was wir für Sie bereits an Kosten ausgelegt haben. \
';

function nkabrechnung_report( uid, year, map_contract_to_coal )
{
  var title = `Nebenkostenabrechnung ${year}`;
  
  // PDF setup
  
  global.window = {document: {createElementNS: () => {return {}} }};
  global.navigator = {};
  global.html2pdf = {};
  global.btoa = () => {};
  const fs = require('fs');
  const jsPDF = require('jspdf');
  var doc = new jsPDF( 'p', 'mm', 'dina4' );
  doc.setFontSize(16);
  doc.text( title, 10, 10 );
  doc.setFontSize(12);
  
  var keys = Object.keys( map_contract_to_coal );
  keys.sort();
  var n = keys.length;
  var tdr = '<td class="right">';
  a = [];
  for( let i = 0; i < n; ++i ) {
    var k = keys[i];
    var c = map_contract_to_coal[k];
    
    //console.log(c);
    
    var labels = [];
    var values = [];

    // Faktor Hauskosten umlagefähig: x,xxxxx
    // 
    // 1. Daraus: anteiliges Hausgeld: xxx,xx €
    // 2. Grundsteuer: xxx.xx €
    // 3. Wartung Rauchmelder: xxx,xx €
    // 4. Energiekosten: xxx,xx €
    // 5. Summe Nebenkosten: xxx.xx €
    // 6. Geleistete Vorrauszahlungen: xxx,xx €
    // 7. Evtl. Rückbehalt: xxx,xx €
    // 8. Guthaben (+) oder Nachzahlung (-): xxx,xx €
    // 
    // daraus ergibt sich eine zukünftige Miete:
    // 
    // 9. Kaltmiete, wie bisher: xxx,xx €
    // 10. NK- Vorrauszahlung, neu: xxx,xx €
    // 11. Sonstige Mieten (Garage usw.): xxx,xx €
    // 12. Summe monatliche Miete: xxx,xx €
    
    labels.push( 'Faktor Hauskosten umlagefähig' );
    values.push( c.faktor_hauskosten_umlagefaehig.toFixed(4) );
    labels.push( '1. Daraus: anteiliges Hausgeld' );
    values.push( c.hausgeld_umlagefaehig.toFixed(2) );
    labels.push( '2. Grundsteuer' );
    values.push( c.grundsteuer.toFixed(2) );
    labels.push( '3. Wartung Rauchmelder' );
    values.push( c.rauchmelderwartung.toFixed(2) );
    labels.push( '4. Energiekosten' );
    values.push( c.energycost.toFixed(2) );
    labels.push( '5. Summe Nebenkosten' );
    values.push( c.nebenkosten.toFixed(2) );
    labels.push( '6. Geleistete Vorrauszahlungen' );
    values.push( c.nkvorauszahlung.toFixed(2) );
    labels.push( '7. Evtl. Rückbehalt' );
    values.push( c.rueckbehalt.toFixed(2) );
    labels.push( '8. Guthaben (+) oder Nachzahlung (-)' );
    values.push( c.credit.toFixed(2) );
    
    var labels2 = [];
    var values2 = [];

    labels2.push( '9. Kaltmiete, wie bisher' );
    values2.push( c.old_rent_pm.toFixed(2) );
    labels2.push( '10. NK- Vorrauszahlung, neu' );
    values2.push( c.new_nkvorauszahlung_pm.toFixed(2) );
    labels2.push( '11. Sonstige Mieten (Garage usw.)' );
    values2.push( c.old_rent_other_pm.toFixed(2) );
    
    const total = c.old_rent_pm + c.new_nkvorauszahlung_pm + c.old_rent_other_pm;
    
    labels2.push( '12. Neue Warmmiete' );
    values2.push( total.toFixed(2) );
    
    var j = 0;
    var s = `<h3>Mietvertrag ${c.contract_id}</h3>\n`;
    s += `<p>${c.salutation} ${c.addressee}, ${c.address}</p>\n`;
    s += '<table>\n';
    s += `<tr><td class="right ul">${labels[j]}</td><td class="right ul">${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}<u>${values[j]}</u></td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}<b>${values[j]}</b></td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}${values[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels[j]}</td>${tdr}<b>${values[j]}</b></td></tr>\n`; ++j;
    s += '</table>\n';
    s += '<p>Daraus ergibt sich folgende zukünftige Warmmiete:</p>';
    j = 0;
    s += '<table>\n';
    s += `<tr>${tdr}${labels2[j]}</td>${tdr}${values2[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels2[j]}</td>${tdr}${values2[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels2[j]}</td>${tdr}${values2[j]}</td></tr>\n`; ++j;
    s += `<tr>${tdr}${labels2[j]}</td>${tdr}<u>${values2[j]}</u></td></tr>\n`; ++j;
    s += '</table>\n';

    a.push( s );

    doc.addPage();

    var lines = [];
    lines.push( 'Weidenmüller GmbH, Todtmooser Strasse 67, D-79872 Bernau' );
    lines.push( '' );
    lines.push( c.salutation );
    lines.push( c.addressee );
    lines.push( c.address );
    lines.push( '' );
    lines.push( 'Mietvertrag ' + c.contract_id );
    
    doc.text( 20, 20, lines );
    
    lines = doc.splitTextToSize( pdf_template_text, 150 );
    
    doc.text( 20, 80, lines );
    
    doc.text( 100, 200, labels, {'align': 'right'} );
    doc.text( 120, 200, values, {'align': 'right'} );

    doc.text( 20, 270, 'Rheinfelden, den 15. Juli 2020' );
    
    //break; // after processing first contract for debugging
  }
  
  // PDF teardown
  
  var pdfdata = doc.output();
  var pdfname = `nk-${uid}-${year}.pdf`;
  fs.writeFileSync( './public/' + pdfname, pdfdata, 'binary' );
  delete global.window;
  delete global.html2pdf;
  delete global.navigator;
  delete global.btoa;            
  
  var s2 = `<h1>${title}</h1>\n`;
  s2 +=  a.join('\n');
  s2 += `\n<br/><p><a href="/${pdfname}">PDF</a></p>`;
  return wrap_html( s2 );
}

module.exports = {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents,
  jtformgen_unit_selected,
  jtformgen_edit_document,
  nkabrechnung_report
};
