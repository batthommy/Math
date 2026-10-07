const bottoneApri = document.getElementById("bottone-apri");
const bottoneRicerca = document.getElementById("bottone-ricerca");
const barraRicerca = document.getElementById("barra-ricerca");
const catalogo = document.getElementById("catalogo");

/* -----------------------------
   LISTA ARGOMENTI
----------------------------- */

const argomenti = [];
let datiCompleti = [];

fetch("nomi.json")
    .then(r => r.json())
    .then(dati => {

        datiCompleti = dati;

        argomenti.length = 0;

        dati.forEach(item => argomenti.push(item.argomento));
    });

/* -----------------------------
   STATO MENU
----------------------------- */

function apriCatalogo() {
    bottoneApri.classList.add("aperto");
    catalogo.classList.add("aperto");
}

function chiudiCatalogo() {
    bottoneApri.classList.remove("aperto");
    catalogo.classList.remove("aperto");
}

function toggleCatalogo() {
    bottoneApri.classList.toggle("aperto");
    catalogo.classList.toggle("aperto");
}

bottoneApri.addEventListener("click", toggleCatalogo);

/* -----------------------------
   RENDER
----------------------------- */

function renderCatalogo(lista) {

    catalogo.innerHTML = "";

    if(lista.length === 0) {

        const span = document.createElement("span");
        span.textContent = "Nessun risultato";
        span.style.opacity = "0.6";

        catalogo.appendChild(span);

        return;
    }

    lista.forEach(argomento => {

        const span = document.createElement("span");

        span.textContent = argomento;

        span.addEventListener("click", () => {

            barraRicerca.value = argomento;

            ricercaDefinitiva(argomento);
        });

        catalogo.appendChild(span);
    });
}

/* -----------------------------
   FILTRO LIVE
----------------------------- */

function aggiornaRicerca() {

    const testo = barraRicerca.value
        .trim()
        .toLowerCase();

    const risultati = argomenti.filter(argomento =>
        argomento.toLowerCase().includes(testo)
    );

    renderCatalogo(risultati);

    if(!catalogo.classList.contains("aperto"))
        apriCatalogo();
}

/* -----------------------------
   RICERCA DEFINITIVA
----------------------------- */

function ricercaDefinitiva(testo) {
    const trovato = datiCompleti.find(item =>
        item.argomento.toLowerCase() === testo.trim().toLowerCase()
    );

    if(trovato) {
        window.location.href = trovato.file + "?tipe=" + encodeURIComponent(trovato.argomento);
    }
    else {
        alert("Argomento non trovato");
    }
}

/* -----------------------------
   EVENTI
----------------------------- */

barraRicerca.addEventListener("input", aggiornaRicerca);

barraRicerca.addEventListener("focus", () => {

    aggiornaRicerca();

    apriCatalogo();
});

barraRicerca.addEventListener("keydown", e => {

    if(e.key === "Enter") {

        ricercaDefinitiva(barraRicerca.value);
    }
});

bottoneRicerca.addEventListener("click", () => {

    ricercaDefinitiva(barraRicerca.value);
});

/* -----------------------------
   START
----------------------------- */

renderCatalogo(argomenti);


/* -----------------------------
   PER LEGGERE IL TIPO DI PAGINA
----------------------------- */

const url = new URL(window.location.href);
let pagina = url.searchParams.get("tipe");

if (!pagina) {
    pagina = "home";
}

const elemento = document.getElementById("cosa");
elemento.textContent = pagina.charAt(0).toUpperCase() + pagina.slice(1);








const impo = document.getElementById("impo");

const menuImpo = document.getElementById("menu-impo");

impo.addEventListener("click", () => {

    menuImpo.classList.toggle("aperto");

    impo.classList.toggle("aperto");
});

fetch("../nomi.json")
    .then(r => r.json())
    .then(dati => {

        /* HOME */

        document.getElementById("torna-home-card")
            .addEventListener("click", () => {

                window.location.href = "../index.html";
            });

        /* ULTIMO */

        const ultimo = dati[dati.length - 1];

        document.querySelector(
            "#ultimo-articolo .impo-testo"
        ).textContent = ultimo.argomento;

        document.getElementById("ultimo-articolo")
            .addEventListener("click", () => {

                apriArticolo(ultimo);
            });

        /* RANDOM */

        document.getElementById("articolo-random")
            .addEventListener("click", () => {

                const random =
                    dati[
                        Math.floor(
                            Math.random() * dati.length
                        )
                    ];

                apriArticolo(random);
            });

        /* BEST */

        const bestList =
            dati.filter(x => x.best);

        if(bestList.length > 0) {

            let htmlBest = "";

            bestList.slice(0,3).forEach((item,index) => {

                htmlBest += item.argomento;

                if(index < Math.min(bestList.length - 1,2))
                    htmlBest += ", ";
            });

            if(bestList.length > 3)
                htmlBest += " ...";

            document.querySelector(
                "#articolo-best .impo-testo"
            ).textContent = htmlBest;

            document.getElementById("articolo-best")
                .addEventListener("click", () => {

                    apriCatalogo();

                    catalogo.innerHTML = "";

                    bestList.forEach(item => {

                        const span =
                            document.createElement("span");

                        span.textContent =
                            "🔥 " + item.argomento;

                        span.addEventListener("click", () => {

                            apriArticolo(item);
                        });

                        catalogo.appendChild(span);
                    });
                });
        }
});

function apriArticolo(item) {

    if(!item || !item.file)
        return;

    window.location.href =
        item.file +
        "?tipe=" +
        encodeURIComponent(item.argomento);
}