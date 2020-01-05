var daneJSON = null;
var tlumaczenia = {}

fetch('plan.json')
  .then(response => response.json())
  .then(dane => daneJSON = dane)
  .then(x => {
    wygenerujPlanZajec();
    zaznaczKolokwia();
    wczytajTlumaczenia();
  });

function wygenerujPlanZajec()
{
  if (daneJSON)
  {
    let plan = daneJSON['plan'];
    let parent = document.getElementsByTagName('main')[0];
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');
    
    for (obj of plan)
    {
      let typ = obj['typ'];

      if (typ != 'egzamin')
      {
        let info = [
          obj['termin'],
          `${obj['od-godz']} - ${obj['do-godz']}`,
          typ,
          obj['przedmiot'],
          'sala' in obj ? obj['sala'] : null,
          'nauczyciel' in obj ? obj['nauczyciel']['#text'] : null,
        ];

        let tr = document.createElement('tr');
        
        for (kolumna of info)
        {
          let td = document.createElement('td');
          td.innerText = kolumna;
          tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
      }
    }

    table.appendChild(tbody)
    parent.appendChild(table);
  }
}

function zaznaczKolokwia()
{
  if (daneJSON)
  {
    let kolokwia = {};

    for (dane of daneJSON['dane-o-kolokwiach'])
    {
      if (!(dane['przedmiot'] in kolokwia))
        kolokwia[dane['przedmiot']] = [];

      for (i in dane['kolokwia'])
        kolokwia[dane['przedmiot']].push(dane['kolokwia'][i]['data']);
    }

    $('main table tbody tr').each(function() {
      let przedmiot = null;
      let data = null;

      $(this).find('td').each(function(i) {
        if (i == 0) data = $(this)[0].innerText;
        if (i == 3) przedmiot = $(this)[0].innerText;
      });

      if (przedmiot in kolokwia && kolokwia[przedmiot].includes(data))
      {
        $(this).addClass('kolokwium');

        $(this).click(function() {
          $(this).find('td').each(function(i) {
            if (i == 3 && $(this)[0].innerText in tlumaczenia)
              $(this).text(tlumaczenia[$(this)[0].innerText]);
          });
        });

        $(this).hover(function() {
          for (obj of daneJSON['dane-o-kolokwiach'])
            if (obj['przedmiot'] == przedmiot)
              for (i in obj['kolokwia'])
                if (obj['kolokwia'][i]['data'] == data)
                {
                  let okno = $('#temat');
                  okno.css('opacity', 0.9);
                  okno.css('visibility', 'visible');
                  okno.text(obj['kolokwia'][i]['tematyka']);
                  break;
                }
        }, function() {
          let okno = $('#temat');
          okno.css('opacity', 0);
          okno.css('visibility', 'hidden');
        });
      }
    });
  }
}

function wczytajTlumaczenia()
{
  let dane = daneJSON['plan'];

  for (obj of dane)
    tlumaczenia[obj['przedmiot']] = obj['nazwa-ang'];
}