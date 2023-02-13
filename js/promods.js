var e = 8;

var url = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
var wanttofollow = [!1, "", 0, !0];
var o = L.layerGroup();
let n = L.layerGroup();
var l = "";
var map = L.map("mapts", {
    crs: L.CRS.Simple
});

///////BOUNDS
var i = L.latLngBounds(map.unproject([0, 262144], e), map.unproject([262144, 0], e));

L.tileLayer("/ets2promods/Tiles/{z}/{x}/{y}.png", {
    maxZoom: e,
    minZoom: 0,
    minNativeZoom: 0,
    maxNativeZoom: e,
    tileSize: 1024,
    reuseTiles: !0,
    bounds: i
}).addTo(map);

map.setView([312, 312], 0);


///////WATERMARK
L.Control.Watermark = L.Control.extend({
    onAdd: function(map) {
        var img = L.DomUtil.create("img")
        img.src = "/images/brand.png"
        img.style.width = "200px"
        return img
    },
    onRemove: function(map) {}
});

L.Control.watermark = function(opts) {
    return new L.Control.Watermark(opts)
}

L.Control.watermark({ position: "bottomleft" }).addTo(map)


var a = new L.FeatureGroup;
var r = new L.Control.Draw({
    draw: {
        polyline: {
            shapeOptions: {
                color: "red",
                opacity: "0.6",
                weight: "5",
                clickable: !1
            },
            icon: new L.DivIcon({
                iconSize: new L.Point(7.5, 7.5)
            })
        },
        polygon: {
            showArea: !0,
            shapeOptions: {
                color: "red",
                opacity: "0.6",
                weight: "3",
                clickable: !1
            },
            icon: new L.DivIcon({
                iconSize: new L.Point(7.5, 7.5)
            })
        },
        rectangle: !1,
        circle: !1
    },
    edit: {
        featureGroup: a
    },
    position: "topright"
});


map.zoomControl.setPosition("bottomright");
a.addTo(map);
map.addControl(r);
o.addTo(map);
n.addTo(map);
map.setMaxBounds(i);

// INPUT SELECT A CITY...
// Object.keys(g_cities_json).sort().forEach(function (city) {
//     l += "<option value='" + city + "'>" + city + "</option>";
// });
// document.getElementById("inputtype").innerHTML += l;

// ADDING FLAGS LAYERS...
// Object.keys(g_countries_json).forEach(function (country) {
//     var pos = game_coord_to_image(g_countries_json[country].pos[0], g_countries_json[country].pos[1]);
//     temp = new L.Marker(map.unproject(pos, e), { icon: new L.DivIcon({ className: 'flags', html: '<img src="flags/' + g_countries_json[country].country_code.toLowerCase() + '.svg" ><br>' + g_countries_json[country].name }) }).addTo(map);
//     o.addLayer(temp);
// });
// o.addTo(map);

for (var s = 0; s < url.length; s++) {
    if ("follow=" === url[s].substring(0, 7)) {
        url[s] = decodeURI(url[s].replace("follow=", ""));
        try {
            wanttofollow[0] = !0;
            wanttofollow[1] = url[s];
            wanttofollow["3"] = !0;
            map.setZoom(e)
        } catch (e) { }
    } else if ("export=" === url[s].substring(0, 7)) {
        settings = decodeURI(url[s].replace("export=", "")).split(",");
        counter = 0;
        middle = [0, 0, 0];
        while (counter < settings.length - 1) {
            type = settings[counter];
            if ("polyline" === type || "polygon" === type) {
                counter++;
                colorsh = settings[counter];
                counter++;
                offset = 2 * parseInt(settings[counter]) + counter;
                counter++;
                points = [];
                while (counter <= offset) {
                    lat = parseFloat(settings[counter]);
                    counter++;
                    lng = parseInt(settings[counter]);
                    middle[0] += lat;
                    middle[1] += lng;
                    points.push(new L.LatLng(lat, lng));
                    middle[2] += 1;
                    counter++
                }
                if ("polyline" === type) a.addLayer(new L.Polyline(points, {
                    color: colorsh, weight: 5, opacity: .6, clickable: !1
                }));
                else a.addLayer(new L.Polygon(points, {
                    color: colorsh, opacity: .6, weight: 3, clickable: !1
                }))
            } else {
                counter++;
                lat = settings[counter];
                counter++;
                lng = settings[counter];
                counter++;
                middle[0] += lat;
                middle[1] += lng;
                middle[2] += 1;
                if ("" === settings[counter] || "Click here to change text" === settings[counter]) a.addLayer(new L.marker([lat, lng]));
                else a.addLayer(new L.marker([lat, lng]).bindPopup(settings[counter].replace("(^)", ",")));
                counter++
            }
        }
        middle[0] = middle[0] / middle[2];
        middle[1] = middle[1] / middle[2];
        map.setView(middle, 4)
    } else if ("mode=" === url[s].substring(0, 5)) {
        if ("frame" == url[s].replace("mode=", "")) {
            document.getElementsByClassName("leaflet-draw")[0].style.display = "none";
            document.getElementById("toolmapinfo").style.display = "none"
        } else if ("minimal" == url[s].replace("mode=", "")) {
            document.getElementsByClassName("leaflet-draw")[0].style.display = "none";
            document.getElementById("toolmapinfo").style.display = "none";
            document.getElementById("search").style.display = "none";
            document.getElementById("infopl").style.display = "none";
            map.removeControl(map.zoomControl)
        }
    } else if ("zoom=" === url[s].substring(0, 5)) {
        map.setZoom(url[s].replace("zoom=", ""));
    } else if ("draggable=" === url[s].substring(0, 10) && "false" == url[s].replace("draggable=", "")) {
        map.dragging.disable();
    } else if ("zoomable=" === url[s].substring(0, 9) && "false" == url[s].replace("zoomable=", "")) {
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable()
    }
}

// EVENT HANDLERS 
map.on("zoom", function () {
    for (var i = 0; i < document.getElementsByClassName('citiesnames').length; i++) {
        document.getElementsByClassName('citiesnames')[i].style.opacity = String((map.getZoom() - 2) / 4);
    };
    for (var i = 0; i < document.getElementsByClassName('flags').length; i++) {
        document.getElementsByClassName('flags')[i].style.opacity = String(map.getZoom());
    };
});

map.on('drag', function () {
    wanttofollow[0] = false;
    document.getElementById("infopl").style.bottom = "-150px";
});

document.getElementsByClassName("leaflet-draw-draw-polyline")[0].addEventListener("mouseover", (function () {
    document.getElementById("colorpolyline").style.width = "210px"
}));
document.getElementsByClassName("leaflet-draw-draw-polyline")[0].addEventListener("mouseout", (function () {
    document.getElementById("colorpolyline").style.width = "0px"
}));
document.getElementById("colorpolyline").addEventListener("mouseover", (function () {
    document.getElementById("colorpolyline").style.width = "210px"
}));
document.getElementById("colorpolyline").addEventListener("mouseout", (function () {
    document.getElementById("colorpolyline").style.width = "0px"
}));
document.getElementsByClassName("leaflet-draw-draw-polygon")[0].addEventListener("mouseover", (function () {
    document.getElementById("colorpolygon").style.width = "210px"
}));
document.getElementsByClassName("leaflet-draw-draw-polygon")[0].addEventListener("mouseout", (function () {
    document.getElementById("colorpolygon").style.width = "0px"
}));
document.getElementById("colorpolygon").addEventListener("mouseover", (function () {
    document.getElementById("colorpolygon").style.width = "210px"
}));
document.getElementById("colorpolygon").addEventListener("mouseout", (function () {
    document.getElementById("colorpolygon").style.width = "0px"
}));

map.on(L.Draw.Event.CREATED, (function (e) {
    console.log(e)
    var type = e.layerType,
        o = e.layer;
    if ("marker" === type) {
        o.bindPopup('<div onclick="clickpopup(this)" onkeypress="writepopup(event,this)" >Click here to change text</div>');
        o.on("popupclose", (function (e) {
            e.target.bindPopup(e.innerHTML)
        }))
    }
    a.addLayer(o)
}));

/////////PLAYER LOCATION
function getUsers() {
    fetch("/api/ets2promods").then((body) => {
        return body.json()
    }).then((json) => {
        return playerData(json)
    }).catch((err) => { })
}


function playerData(json) {
    const players = json.players

    infos = "";
    n.clearLayers();

    for (var i = 0; i < players.length; i++) {
        if (players[i].truck.worldPlacement.x != 0 && players[i].truck.worldPlacement.z != 0) {
            truck = players[i].truck
            jobStart = (players[i].job.onJob) ? players[i].job.sourceCity : -1;
            jobEnd = (players[i].job.onJob) ? players[i].job.destinationCity : -1;
            trailerDamage = (players[i].truck.trailerConnected) ? Math.floor(players[i].truck.damages.trailer * 100) : -1;
            truckDamage = Math.floor(truck.damages.chassis * 100);
            coordtruck = game_coord_to_image(truck.worldPlacement.x, truck.worldPlacement.z);
            // console.log(coordtruck)
            eventclick = "map.setView(map.unproject([" + coordtruck[0] + "," + coordtruck[1] + "], 8),7);putinfo(\"" + players[i].user.steamUsername + "\",\"" + truck.make + " " + truck.model + "\",\"" + Math.floor(truck.speed * 3.6) + "\",\"" + truck.fuel.currentLitres + "\",\"" + jobStart + "\",\"" + jobEnd + "\",\"" + truckDamage + "\",\"" + trailerDamage + "\");hidemenu();wanttofollow = [true,\"" + players[i].user.steamID + "\"];";
            temp = new L.Marker(map.unproject(coordtruck, e), { icon: new L.DivIcon({ className: 'player', html: "<div class='circle' id='" + players[i].user.steamID + "' onclick='" + eventclick + "''style='background-color:#008f91;'></div>" }) });

            n.addLayer(temp);

            infos += "<li class='playerlist' onclick='" + eventclick + "'><i class='material-icons'>&#xE558;</i><div> </div>" + players[i].user.steamUsername + "</li>";
            if (players[i].user.steamID == wanttofollow[1] && wanttofollow[0] == true && document.getElementById(wanttofollow[1])) {
                document.getElementById(wanttofollow[1]).style.backgroundColor = "#0fff06";
                map.setView(map.unproject([coordtruck[0], coordtruck[1]], 8), map.getZoom());
                putinfo(players[i].user.steamUsername, truck.make + " " + truck.model, Math.floor(truck.speed * 3.6), truck.fuel.currentLitres, jobStart, jobEnd, truckDamage, trailerDamage);
            }
        }
    }
    if (!document.getElementById(wanttofollow[1])) {
        document.getElementById("infopl").style.bottom = "-200px";
    }
    document.getElementById("list").innerHTML = infos;
    setTimeout(function () {
        getUsers();
    }, 500);
}


function game_coord_to_image(x, y) {
    return convertXY(x, y)
}

function convertXY(x, y) {
    let o = -107858.75,
        n,
        l = -164495.0,
        i,
        a,
        r;
    const s = undefined;
    const c = undefined;
    const d = undefined;
    const m = undefined;
    return [(x - o) / (163953.44 - o) * 262144, (y - l) / (107317.19 - l) * 262144]
}

function putAlert() {
    document.getElementById("alert").style.opacity = 1;
    document.getElementById("alert").style.zIndex = 1e4
}

function clearAlert() {
    document.getElementById("alert").style.opacity = 0;
    document.getElementById("alert").style.zIndex = -10
}

function clickpopup(e) {
    if ('<input type="text" placeholder="Press Enter to save"' !== e.innerHTML.substring(0, 52)) {
        if ("Click here to change text" != e.outerText) textbefore = e.outerText;
        else textbefore = "";
        e.innerHTML = '<input type="text" placeholder="Press Enter to save" spellcheck="false" style="width:' + e.offsetWidth + 'px;" value="' + textbefore + '" />';
        e.getElementsByTagName("input")[0].focus();
        e.getElementsByTagName("input")[0].select()
    }
}

function writepopup(e, t) {
    if (13 === e.keyCode) t.innerHTML = t.getElementsByTagName("input")[0].value
}

function setcolor(e) {
    values = e.split(".");
    if ("red" === values[1]) whited = "#FF5555";
    else if ("blue" === values[1] || "green" === values[1]) whited = "light" + values[1];
    else whited = values[1];
    if ("polyline" === values[0]) r.setDrawingOptions({
        polyline: {
            shapeOptions: {
                color: values[1],
                opacity: "0.6",
                weight: "5",
                clickable: !1
            }
        }
    });
    else r.setDrawingOptions({
        polygon: {
            showArea: !0,
            shapeOptions: {
                color: values[1],
                opacity: "0.6",
                weight: "3",
                clickable: !1
            }
        }
    });
    document.getElementsByClassName("leaflet-draw-draw-" + values[0])[0].style.backgroundColor = whited
}

function share() {
    link = "";
    for (var e in a._layers) {
        layer = a._layers[e];
        if (layer instanceof L.Marker) {
            link += "marker," + layer._latlng.lat + "," + layer._latlng.lng + ",";
            try {
                if ("Click here to change text" === layer._popup._wrapper.innerText) throw TypeError;
                link += layer._popup._wrapper.innerText.replace(",", "(^)") + ","
            } catch (e) {
                link += ","
            }
        }
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            link += "polyline," + layer.options.color + "," + layer.editing.latlngs[0].length + ",";
            for (var t = 0; t < layer.editing.latlngs[0].length; t++)link += String(layer.editing.latlngs[0][t].lat) + "," + String(layer.editing.latlngs[0][t].lng) + ","
        }
        if (layer instanceof L.Polygon && !(layer instanceof L.Rectangle)) {
            link += "polygon," + layer.options.color + "," + layer.editing.latlngs[0][0].length + ",";
            for (var t = 0; t < layer.editing.latlngs[0][0].length; t++)link += String(layer.editing.latlngs[0][0][t].lat) + "," + String(layer.editing.latlngs[0][0][t].lng) + ","
        }
    }
    box = document.getElementById("boxlink");
    sharebox = document.getElementById("sharebox");
    box.value = "https://insanodev.com/map/promods?export=" + link;
    sharebox.style.opacity = "1";
    sharebox.style.visibility = "visible";
    box.select();
    box.focus();
    hidemenu()
}

function copyshare() {
    document.getElementById("boxlink").select();
    document.getElementById("boxlink").focus();
    try {
        var e = document.execCommand("copy")
    } catch (e) { }
}

function gotocity(t) {
    if (0 != t) {
        citycoords = game_coord_to_image(g_cities_json[t].x, g_cities_json[t].z);
        map.setView(map.unproject(citycoords, e), e - 1)
    }
    wanttofollow[0] = !1
}

function showmenu() {
    document.getElementById("drawer").style.left = "0px"
}

function hidemenu() {
    document.getElementById("drawer").style.left = "-360px"
}

// let c = "favorites";

// function favorite(e) {
//     let t = [];
//     if (null === localStorage.getItem(c)) t = [e];
//     else {
//         t = JSON.parse(localStorage.getItem(c));
//         t.push(e)
//     }
//     localStorage.setItem(c, JSON.stringify(t))
// }

// function unFavorite(e) {
//     let t = [];
//     if (null === localStorage.getItem(c));
//     else {
//         t = JSON.parse(localStorage.getItem(c));
//         let o = t.indexOf(e);
//         if (-1 !== o) t.splice(o, 1);
//         localStorage.setItem(c, JSON.stringify(t))
//     }
// }

// function isFavorite(e) {
//     let t = [];
//     if (null === localStorage.getItem(c)) return !1;
//     else t = JSON.parse(localStorage.getItem(c));
//     if (t) {
//         let o;
//         if (-1 === t.indexOf(e)) return !1;
//         else return !0
//     } return !1
// }

function putinfo(nick, brand, speed, fuel, from, to, damtruck, damtrailer) {
    textvtc = " for InsanoDev ";
    html = nick + "<p>Driving a " + brand + textvtc + "<br>Speed: " + parseInt(speed) + "km/h<br>Fuel: " + parseInt(fuel) + "L" + "<br>Truck damage: " + parseInt(damtruck) + "%<br>"
    if (from != -1 && to != -1) {
        html += "With a trailer from " + from + " to " + to + "<br>";
    }
    if (damtrailer != -1) {
        html += "Trailer damage: " + parseInt(damtrailer) + "%";
    }
    html += "<i class='material-icons' onclick='document.getElementById(\"infopl\").style.bottom = \"-150px\";wanttofollow=[false,\"\",0,false];'>&#xE5CF;</i>"
    document.getElementById("infopl").innerHTML = html;
    document.getElementById("infopl").style.bottom = "10px";
}

getUsers();