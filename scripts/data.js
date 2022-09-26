// $.ajax({
//     url:"https://pokeapi.co/api/v2/pokemon/"
// })
// .done(res=>{
//     // returns array of objects
//     console.log(res.results);
//     let html = "";
//     res.results.forEach((_data, index)=>{
//         // filling the table body
//         html += `
//             <tr>
//                 <td>${index+1}</td>
//                 <td>${_data.name}</td>
//                 <td>
//                     <button type="button" onClick="retrieve('${_data.url}')" class="btn btn-primary" data-toggle="modal" data-target="#pokemonDetail">Details</button>
//                 </td>
//             </tr>
//         `
//     });
//     $("#tBodyPokedex").html(html);
// })
// .fail(err=>console.log(err))

$(document).ready(function(){
    //akan dijalankan saat DOCUMENT/HTML selesai di load (ready)
    $("#dataTableSW").DataTable({
        "ajax": { 
            url: "https://pokeapi.co/api/v2/pokemon/", 
            type: "GET",
            dataSrc: "results",
            dataType: "JSON"
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                "data": "",
                "render": function ( data, type, row ) {
                    // return  `Rp. ${row.name}`;
                    return  `${row.name}`;
                }
            },
            {
                "data": "",
                "render": function ( data, type, row ) {
                    // row represents all the data returned
                    return  `<button type="button" onClick="retrieve('${row.url}')" class="btn btn-primary" data-toggle="modal" data-target="#pokemonDetail">Details</button>`;
                }
            }
        ]
    });
});


// when the detail button clicked this function will run
function retrieve(url){
    $.ajax({
        url: url
    })
    .done(res=>{
        console.log(res);
        // form validation (required) bootstrap, child row datatables, button export datatables, tooltip bootstrap, sweet alert, Bfrtip, apex chart
        // the whole details
        let html = `
            <img class="rounded mx-auto d-block" style="width: 250px;" src="${res.sprites.other["official-artwork"].front_default}">
            <h1 class="text-center">${res.name.toUpperCase()}</h1>
            <div id="pokemonTypes" class="text-center"></div>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" data-target="#nav-info" type="button" role="tab">Info</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" data-target="#nav-stats" type="button" role="tab">Stats</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="nav-info" role="tabpanel"></div>
                <div class="tab-pane fade" id="nav-stats" role="tabpanel"></div>
            </div>
        `;
        $("#modalPokemonDetail").html(html);

        // badges
        let typeBadges="";
        let badgeColor="";
        res.types.forEach((_data, index)=>{
            if(_data.type.name === "grass" || _data.type.name === "bug"){
                badgeColor = "badge-success"
            }
            else if(_data.type.name === "poison" || _data.type.name === "flying"){
                badgeColor = "badge-secondary"
            }
            else if(_data.type.name === "fire"){
                badgeColor = "badge-danger"
            }
            else if(_data.type.name === "water"){
                badgeColor = "badge-info"
            }
            else{
                badgeColor = "badge-primary"
            }
            typeBadges +=`
                <span class="badge badge-pill ${badgeColor}">${_data.type.name}</span>
            `;
        });
        $("#pokemonTypes").html(typeBadges);

        // abilities list
        var abilitiesHTML ="";
        res.abilities.forEach(_data=>{
            abilitiesHTML += `
                <li>${_data.ability.name}</li>
            `;
        })

        // tab info
        let tabInfo = `
            <table class="table">
                <tbody>
                    <tr>
                        <th style="width:150px;">Height</th>
                            <td>${res.height}</td>
                    </tr>
                    <tr>
                        <th>Weight</th>
                            <td class="text-left">${res.weight}</td>
                    </tr>
                    <tr>
                        <th>Base Exp</th>
                            <td>${res.base_experience}</td>
                    </tr>
                    <tr>
                        <th>Abilities</th>
                            <td>
                                <ul style="padding: 0; list-style-type: none;">
                                    ${abilitiesHTML}
                                </ul>
                            </td>
                    </tr>
                </tbody>
            </table>
        `;
        $("#nav-info").html(tabInfo);

        // tab stats
        let tabStats = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th style="width:150px;">Stat Name</th>
                    <th style="width:50px;">Effort</th>
                    <th style="width:250px;">Base Stats</th>
                </tr>
            </thead>
            <tbody id="tBodyStats">
            </tbody>
        </table>
        `;
        $("#nav-stats").html(tabStats);

        // stats progress bar
        let statsHtml = "";
        res.stats.forEach((_data, index)=>{
            // filling the table body
           statsHtml += `
                <tr>
                    <td>${_data.stat.name.toUpperCase()}</td>
                    <td>${_data.effort}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar bg-success" role="progressbar" style="width: ${_data.base_stat}%" aria-valuenow="${_data.base_stat}" aria-valuemin="0" aria-valuemax="100">${_data.base_stat}</div>
                        </div>
                    </td>
                </tr>
            `
        })
        $("#tBodyStats").html(statsHtml);
    })
    .fail(err=>console.log(err))
}
