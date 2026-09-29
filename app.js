const $ = (id) => document.getElementById(id);

const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

function showStatus(message, error = false) {

  const status = $("status");

  status.textContent = message;

  status.style.borderColor =
    error ? "#713f47" : "#33415a";
}

function escapeHTML(value = "") {

  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

}

async function geocode(place) {

  const response = await fetch(
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      format: "jsonv2",
      limit: "1",
      q: place
    })
  );

  if (!response.ok) {
    throw new Error("Não foi possível localizar o lugar.");
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error("Local não encontrado.");
  }

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    name: data[0].display_name
  };

}

function calculateDistance(a, b) {

  const R = 6371;

  const dLat =
    (b.lat - a.lat) * Math.PI / 180;

  const dLon =
    (b.lon - a.lon) * Math.PI / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R *
    2 *
    Math.atan2(
      Math.sqrt(x),
      Math.sqrt(1 - x)
    );

}

function buildQuery(center, radius, category) {

  const area =
    `(around:${radius},${center.lat},${center.lon})`;

  const categories = {

    restaurant: "amenity=restaurant",

    fast_food: "amenity=fast_food",

    shop: "shop",

    hairdresser: "shop=hairdresser",

    cafe: "amenity=cafe",

    gym: "leisure=fitness_centre",

    clinic: "amenity=clinic",

    hotel: "tourism=hotel",

    car_repair: "shop=car_repair",

    bakery: "shop=bakery"

  };

  if (category === "pizza") {

    return `
      [out:json][timeout:20];

      nwr${area}
      [name]
      [cuisine~"pizza",i];

      out center tags;
    `;

  }

  if (category === "all") {

    return `
      [out:json][timeout:20];

      (
        nwr${area}[name][shop];

        nwr${area}[name]
        [amenity~"restaurant|fast_food|cafe|clinic"];

        nwr${area}[name][tourism=hotel];

        nwr${area}[name]
        [leisure=fitness_centre];
      );

      out center tags;
    `;

  }

  const parts =
    (categories[category] || "shop").split("=");

  const key = parts[0];

  const value = parts[1];

  return `
    [out:json][timeout:20];

    nwr${area}
    [name]
    [${key}${value ? "=" + value : ""}];

    out center tags;
  `;

}

async function queryOverpass(query) {

  for (const server of OVERPASS_SERVERS) {

    try {

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          22000
        );

      const response =
        await fetch(server, {
          method: "POST",
          body: query,
          signal: controller.signal
        });

      clearTimeout(timeout);

      if (response.ok) {

        return await response.json();

      }

    } catch (error) {

      // tenta o próximo servidor

    }

  }

  throw new Error(
    "Os servidores de mapas estão ocupados. Tente novamente em alguns segundos."
  );

}

function formatInstagram(value) {

  if (!value) return "";

  if (value.startsWith("http")) {
    return value;
  }

  return (
    "https://www.instagram.com/" +
    value.replace(/^@/, "") +
    "/"
  );

}

function formatWhatsApp(value) {

  if (!value) return "";

  if (value.startsWith("http")) {
    return value;
  }

  let number =
    value.replace(/\D/g, "");

  if (!number) return "";

  if (
    number.length === 10 ||
    number.length === 11
  ) {
    number = "55" + number;
  }

  return "https://wa.me/" + number;

}

function renderBusiness(business) {

  let phoneActions = "";

  if (business.phone) {

    phoneActions = `

      <a href="tel:${escapeHTML(business.phone)}">
        📞 Ligar
      </a>

      <button
        data-copy="${escapeHTML(business.phone)}">
        📋 Copiar telefone
      </button>

    `;

  }

  let whatsappActions = "";

  if (business.whatsapp) {

    whatsappActions = `

      <a
        href="${escapeHTML(business.whatsapp)}"
        target="_blank"
        rel="noopener">
        💬 Abrir WhatsApp
      </a>

      <button
        data-copy="${escapeHTML(business.whatsapp)}">
        📋 Copiar WhatsApp
      </button>

    `;

  }

  let instagramActions = "";

  if (business.instagram) {

    instagramActions = `

      <a
        href="${escapeHTML(business.instagram)}"
        target="_blank"
        rel="noopener">
        📷 Instagram
      </a>

      <button
        data-copy="${escapeHTML(business.instagram)}">
        📋 Copiar Instagram
      </button>

    `;

  }

  let websiteActions = "";

  if (business.website) {

    websiteActions = `

      <a
        href="${escapeHTML(business.website)}"
        target="_blank"
        rel="noopener">
        🌐 Site
      </a>

    `;

  }

  const mapActions = `

    <a
      href="https://www.openstreetmap.org/?mlat=${business.lat}&mlon=${business.lon}#map=18/${business.lat}/${business.lon}"
      target="_blank"
      rel="noopener">
      🗺️ Mapa
    </a>

  `;

  let chips = `

    <span class="chip good">
      ✓ Encontrado na consulta atual
    </span>

  `;

  if (!business.website) {

    chips += `

      <span class="chip warn">
        Sem site cadastrado
      </span>

    `;

  }

  if (business.instagram) {

    chips += `

      <span class="chip">
        Instagram encontrado
      </span>

    `;

  }

  let opportunity = "";

  if (!business.website || !business.instagram) {

    const reasons = [];

    if (!business.website) {
      reasons.push("não possui site cadastrado");
    }

    if (!business.instagram) {
      reasons.push(
        "Instagram não cadastrado na base"
      );
    }

    opportunity = `

      <div class="opportunity">

        🎨 <strong>Sinal de prospecção:</strong>

        ${reasons.join(" e ")}.

        Isso é apenas um sinal para você analisar,
        não uma avaliação definitiva do negócio.

      </div>

    `;

  }

  return `

    <article class="card">

      <h3>
        ${escapeHTML(business.name)}
      </h3>

      <div class="chips">
        ${chips}
      </div>

      <div class="meta">

        📍 ${business.distance.toFixed(1)} km

        <br>

        ${
          business.address
            ? "🏠 " +
              escapeHTML(business.address) +
              "<br>"
            : ""
        }

        ${
          business.phone
            ? "📞 " +
              escapeHTML(business.phone)
            : "📞 Telefone não cadastrado"
        }

      </div>

      <div class="links">

        ${phoneActions}

        ${whatsappActions}

        ${instagramActions}

        ${websiteActions}

        ${mapActions}

      </div>

      ${opportunity}

      <div class="fresh">

        Base consultada:
        ${escapeHTML(business.time)}

      </div>

    </article>

  `;

}

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest("[data-copy]");

    if (!button) return;

    if (!navigator.clipboard) return;

    navigator.clipboard.writeText(
      button.dataset.copy
    );

    const original =
      button.textContent;

    button.textContent =
      "✓ Copiado";

    setTimeout(() => {

      button.textContent =
        original;

    }, 1200);

  }
);

async function searchBusinesses() {

  const location =
    $("location").value.trim();

  if (!location) {

    showStatus(
      "Digite uma cidade/região ou use sua localização.",
      true
    );

    return;

  }

  const searchButton =
    $("search");

  searchButton.disabled =
    true;

  searchButton.textContent =
    "⏳ Pesquisando...";

  $("results").innerHTML = "";

  try {

    showStatus(
      "1/2 — Localizando a região..."
    );

    const center =
      await geocode(location);

    showStatus(
      "2/2 — Consultando servidores de mapas..."
    );

    const radius =
      Number($("radius").value);

    const category =
      $("category").value;

    const query =
      buildQuery(
        center,
        radius,
        category
      );

    const data =
      await queryOverpass(query);

    const timestamp =
      data.osm3s?.timestamp ||
      "não informado";

    const businesses =
      data.elements
        .map(element => {

          const tags =
            element.tags || {};

          const point = {

            lat:
              Number(
                element.lat ??
                element.center?.lat
              ),

            lon:
              Number(
                element.lon ??
                element.center?.lon
              )

          };

          const whatsapp =
            tags["contact:whatsapp"] ||
            tags.whatsapp ||
            "";

          const instagram =
            tags.instagram ||
            tags["contact:instagram"] ||
            "";

          const website =
            tags.website ||
            tags["contact:website"] ||
            "";

          const phone =
            tags.phone ||
            tags["contact:phone"] ||
            "";

          return {

            name:
              tags.name || "",

            phone,

            whatsapp:
              formatWhatsApp(whatsapp),

            instagram:
              formatInstagram(instagram),

            website,

            address:
              [
                tags["addr:street"],
                tags["addr:housenumber"],
                tags["addr:suburb"]
              ]
                .filter(Boolean)
                .join(", "),

            distance:
              calculateDistance(
                center,
                point
              ),

            lat:
              point.lat,

            lon:
              point.lon,

            time:
              timestamp

          };

        })

        .filter(
          business =>
            business.name &&
            Number.isFinite(business.lat) &&
            Number.isFinite(business.lon)
        )

        .sort(
          (a, b) =>
            a.distance - b.distance
        );

    $("count").textContent =
      businesses.length;

    $("siteOpp").textContent =
      businesses.filter(
        business => !business.website
      ).length;

    $("opp").textContent =
      businesses.filter(
        business =>
          !business.website ||
          !business.instagram
      ).length;

    if (!businesses.length) {

      $("results").innerHTML = `

        <div class="empty">

          Nenhum estabelecimento encontrado
          nessa pesquisa.

        </div>

      `;

    } else {

      $("results").innerHTML =
        businesses
          .map(renderBusiness)
          .join("");

    }

    showStatus(
      `Pronto: ${businesses.length} negócios encontrados.`
    );

  } catch (error) {

    showStatus(
      error.message ||
      "Ocorreu um erro durante a pesquisa.",
      true
    );

  } finally {

    searchButton.disabled =
      false;

    searchButton.textContent =
      "🔍 Pesquisar";

  }

}

$("search").addEventListener(
  "click",
  searchBusinesses
);

$("locate").addEventListener(
  "click",
  () => {

    if (!navigator.geolocation) {

      showStatus(
        "Seu navegador não permite localização. Digite a cidade manualmente.",
        true
      );

      return;

    }

    showStatus(
      "Obtendo sua localização..."
    );

    navigator.geolocation.getCurrentPosition(

      async position => {

        try {

          const response =
            await fetch(
              "https://nominatim.openstreetmap.org/reverse?" +
              new URLSearchParams({
                format: "jsonv2",
                lat: position.coords.latitude,
                lon: position.coords.longitude
              })
            );

          const data =
            await response.json();

          $("location").value =
            data.display_name ||
            `${position.coords.latitude}, ${position.coords.longitude}`;

          showStatus(
            "Localização preenchida. Agora toque em Pesquisar."
          );

        } catch (error) {

          showStatus(
            "Não foi possível obter o endereço.",
            true
          );

        }

      },

      () => {

        showStatus(
          "Não foi possível usar sua localização. Digite a cidade manualmente.",
          true
        );

      }

    );

  }
);
