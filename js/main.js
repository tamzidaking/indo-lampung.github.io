
'use strict';
var kamusJSON = {};
var kamus = {};

var hasilTerjemah = document.getElementById('hasilTerjemah');


function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return false;
    }
};


function fetchKamus() {
    var url = './dispatcher/indonesia2lampung.json';
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
           
            localStorage.setItem('kamusJSON', JSON.stringify(data));
            kamus = data;
            hasilTerjemah.innerHTML = 'Kamus Bahasa Lampung-Indonesia';
            hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
            hasilTerjemah.classList.add("alert", "alert-info");

        })
        .catch(function (error) {
            hasilTerjemah.innerHTML = JSON.stringify(error);
            hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
            hasilTerjemah.classList.add("alert", "alert-warning");
        });
};


function fetchKamusDariLocalStorage(data) {
    kamus = JSON.parse(data);
    hasilTerjemah.innerHTML = 'Kamus Bahasa Lampung-Indonesia';
    hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
    hasilTerjemah.classList.add("alert", "alert-info");
};

if (storageAvailable('localStorage')) {
    if (localStorage.getItem('kamusJSON') === null) {
        
        fetchKamus();
        console.log("Fetch dari API");
    } else {
        console.log("data: " + localStorage.getItem('kamusJSON'));
        fetchKamusDariLocalStorage(localStorage.getItem('kamusJSON'));
        console.log("Fetch dari Local Storage");
    }
} else {
    console.log("Data kamus belum tersedia..");
};

function terjemah(kataAsl, bhasa, strArray) {
    let kataA = "lpgkata",
        kataT = "idkata";


    
    if (bhasa === "indonesia") {
        kataA = "idkata";
        kataT = "lpgkata";
    } else if (bhasa === "lampung") {
        kataA = "lpgkata";
        kataT = "idkata";
    }

    let hasils = [],
        j = 0;

    for (let i = 0; i < strArray.length; i++) {
        if (strArray[i][kataA] === kataAsl) 
        {
            hasils[j] = new Array();
            hasils[j][0] = strArray[i][kataA];
            hasils[j][1] = strArray[i][kataT];
            hasils[j][2] = strArray[i]["lpgdialek"];
            hasils[j][3] = strArray[i]["lpgaksara"];
            j++;
            if (j == 3)
                break;
        }
    }

    return hasils;
};



function createNode(element) {
    return document.createElement(element); 
};


function append(parent, el) {
    return parent.appendChild(el); 
};

var kataAsal = document.getElementById('kataAsal');
var aksaraAsal = document.getElementById('aksaraAsal');
var petunjukAksara = document.getElementById('petunjukAksara');
aksaraAsal.classList.add("hide");
petunjukAksara.classList.add("hide");
var bahasa = document.getElementById("terjemahForm").elements["bahasa"];

bahasa[0].onchange = function () {
    aksaraAsal.classList.remove("hide", "show");
    aksaraAsal.classList.add("hide");
};
bahasa[1].onchange = function () {
    aksaraAsal.classList.remove("hide", "show");
    aksaraAsal.classList.add("show");
};

aksaraAsal.addEventListener("focusin", function () {
    petunjukAksara.classList.remove("hide", "show");
    petunjukAksara.classList.add("show");
});
aksaraAsal.addEventListener("focusout", function () {
    petunjukAksara.classList.remove("hide", "show");
    petunjukAksara.classList.add("hide");
});

kataAsal.onkeyup = function () {
    
    let kataAsals = kataAsal.value.toLowerCase();

    
    if (!kataAsals.replace(/\s/g, '').length) {
        hasilTerjemah.innerHTML = 'Kamus Bahasa Lampung-Indonesia';
        hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
        hasilTerjemah.classList.add("alert", "alert-info");
    } else {
        
        let kataAl = kataAsals.split(/\s+/);
        
        if (kataAl[kataAl.length - 1] == ('')) {
            kataAl.pop();
        }

        
        hasilTerjemah.innerHTML = '';
        hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
        let strong = createNode("strong");
        strong.innerHTML = kataAsal.value + ' (' + bahasa.value + ') : <br/>';
        let spanAksara = createNode('span');
        spanAksara.classList.add("aksaraLampung");
        append(strong, spanAksara);
        append(hasilTerjemah, strong);


        for (let i = 0; i < kataAl.length; i++) {
            
            let terjemahan = terjemah(kataAl[i], bahasa.value, kamus);

            
            let pKata = createNode("p");
            pKata.innerHTML = kataAl[i] + ' (' + bahasa.value + ') ';
            append(hasilTerjemah, createNode("hr"));
            append(hasilTerjemah, pKata);
            append(hasilTerjemah, createNode("hr"));

            
            spanAksara.innerHTML += aksarakan(kataAl[i]) + ' ';

            if (bahasa.value === "indonesia") {
                terjemahan.map(function (dt) {
                    let p = createNode('p'),
                        span1 = createNode('span'),
                        span2 = createNode('span'),
                        span3 = createNode('span'); 
                    span1.innerHTML = dt[0] + " = ";
                    span2.innerHTML = aksarakan(dt[1]);
                    span2.classList.add("aksaraLampung"); 
                    span3.innerHTML = " (" + dt[1] + ")";
                    if (dt[2] != null) {
                        let sup = createNode('sup');
                        sup.innerHTML = dt[2];
                        append(span3, sup);
                    }
                    append(p, span1); 
                    append(p, span2);
                    append(p, span3);
                    append(hasilTerjemah, p);
                })
            } else if (bahasa.value === "lampung") {
                terjemahan.map(function (dt) {
                    let p = createNode('p'),
                        span1 = createNode('span'),
                        span2 = createNode('span'),
                        span3 = createNode('span'); 
                    span1.innerHTML = aksarakan(dt[0]);
                    span1.classList.add("aksaraLampung"); 
                    span2.innerHTML = " (" + dt[0] + ")";
                   
                    if (dt[2] != null) {
                        let sup = createNode('sup');
                        sup.innerHTML = dt[2];
                        append(span2, sup);
                    }
                    span3.innerHTML = " = " + dt[1];
                    append(p, span1); 
                    append(p, span2);
                    append(p, span3);
                    append(hasilTerjemah, p);
                })
            }
            console.log(terjemahan);
        }

        hasilTerjemah.classList.add("alert", "alert-info");
    }
};

aksaraAsal.onkeyup = function () {

    let aksaraAsals = aksaraAsal.value;

   
    if (!aksaraAsals.replace(/\s/g, '').length) {
        aksaraAsal.classList.remove("aksaraLampung");
        hasilTerjemah.innerHTML = 'Kamus Bahasa Lampung-Indonesia';
        hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
        hasilTerjemah.classList.add("alert", "alert-info");
    } else {
        aksaraAsal.classList.add("aksaraLampung");
        
        let aksaraAl = aksaraAsals.split(/\s+/);
     
        if (aksaraAl[aksaraAl.length - 1] == ('')) {
            aksaraAl.pop();
        }

        
        hasilTerjemah.innerHTML = '';
        hasilTerjemah.classList.remove("alert", "alert-info", "alert-warning");
        let strong = createNode("strong");
        strong.innerHTML = alfabetkan(aksaraAsal.value) + ' (' + bahasa.value + ') : <br/>';
        let spanAksara = createNode('span');
        spanAksara.classList.add("aksaraLampung");
        append(strong, spanAksara);
        append(hasilTerjemah, strong);


        for (let i = 0; i < aksaraAl.length; i++) {
           
            let terjemahan = terjemah(alfabetkan(aksaraAl[i]), bahasa.value, kamus);

           
            let pKata = createNode("p");
            pKata.innerHTML = alfabetkan(aksaraAl[i]) + ' (' + bahasa.value + ') ';
            append(hasilTerjemah, createNode("hr"));
            append(hasilTerjemah, pKata);
            append(hasilTerjemah, createNode("hr"));

           
            spanAksara.innerHTML += aksaraAl[i] + ' ';

            if (bahasa.value === "indonesia") {
                terjemahan.map(function (dt) {
                    let p = createNode('p'),
                        span1 = createNode('span'),
                        span2 = createNode('span'),
                        span3 = createNode('span');
                    span1.innerHTML = dt[0] + " = ";
                    span2.innerHTML = aksarakan(dt[1]);
                    span2.classList.add("aksaraLampung"); 
                    span3.innerHTML = " (" + dt[1] + ")";
                    if (dt[2] != null) {
                        let sup = createNode('sup');
                        sup.innerHTML = dt[2];
                        append(span3, sup);
                    }
                    append(p, span1); 
                    append(p, span2);
                    append(p, span3);
                    append(hasilTerjemah, p);
                })
            } else if (bahasa.value === "lampung") {
                terjemahan.map(function (dt) {
                    let p = createNode('p'),
                        span1 = createNode('span'),
                        span2 = createNode('span'),
                        span3 = createNode('span'); 
                    span1.innerHTML = aksarakan(dt[0]);
                    span1.classList.add("aksaraLampung"); 
                    span2.innerHTML = " (" + dt[0] + ")";
                    //jika ada dialek
                    if (dt[2] != null) {
                        let sup = createNode('sup');
                        sup.innerHTML = dt[2];
                        append(span2, sup);
                    }
                    span3.innerHTML = " = " + dt[1];
                    append(p, span1);
                    append(p, span2);
                    append(p, span3);
                    append(hasilTerjemah, p);
                })
            }
            console.log(terjemahan);
        }

        hasilTerjemah.classList.add("alert", "alert-info");
    }
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(function () {
            console.log('SW terdaftar');
        });
};