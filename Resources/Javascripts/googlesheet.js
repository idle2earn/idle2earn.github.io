let SHEET_ID = '1OCZMyZ3Sw2Cc2WGeOSbZLXctWbYycfYiSxp-pGNuuMc'
let SHEET_TITLE = 'ICO';

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE); // + '&range=' + SHEET_RANGE);

let data = []

fetch(FULL_URL)
.then(res => res.text())
.then(rep => {
    let sheet = JSON.parse(rep.substr(47).slice(0,-2));
    console.log("json: " + "%j" + rep);
    let length = sheet.table.rows.length;
    for(let i = 0; i<length;i++){
        if (sheet.table.rows[i].c[0]==null
            || sheet.table.rows[i].c[1]==null
            || sheet.table.rows[i].c[2]==null
            || sheet.table.rows[i].c[3]==null
            || sheet.table.rows[i].c[4]==null)
            continue;
        data.push({ id: sheet.table.rows[i].c[0].v, 
                    address: sheet.table.rows[i].c[1].v, 
                    from_usdt: sheet.table.rows[i].c[2].v, 
                    to_i2e: sheet.table.rows[i].c[3].v,
                    time: sheet.table.rows[i].c[4].v,})
    }
    renderTable(data);
    })

let renderTable = function (arr) {
    $('#table_body').html('');
    let html = "";
    arr.map((item, index) => {
        html += `
        <tr>
        <td>${item.address}</td>
        <td>${item.from_usdt}</td>
        <td>${item.to_i2e}</td>
        <td>${item.time}</td>
        </tr>
        `

        // <tr>
        //     <th scope="row">${index + 1}</th>
        //     <td><a href="${item.address}" target="_blank">${item.address}</a></td>
        //     <td>${item.address}</td>
        //     <td><a href="${item.address}" target="_blank"button class="btn btn-info">Dowload</button></td>
        // </tr>
    })
    console.log(html);
    $('#table_body').append(html);
}

let searchByName = function (arr, name) {
    let item = [];

    
    let fuse = new Fuse(arr, {
        keys: ['name']
      })
      
      // 3. Now search!
    item = fuse.search(name)

    console.log(item)

    return item.map(x=>x.item)
}

function search() {
    if(event.key === 'Enter') {
        onSearchClick();       
    }
}

function onSearchClick(){
    let textSearch = $("#textSearch").val();
    let item = searchByName(data, textSearch);
    if (textSearch == "") {
        renderTable(data);
    } else {
        renderTable(item);
    }
}
