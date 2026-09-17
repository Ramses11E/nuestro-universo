/* =========================================================
   NUESTRO UNIVERSO — script.js
   Organizado en secciones:
   1. Datos del universo (edítalos libremente)
   2. Configuración de categorías
   3. Fondo de estrellas (canvas)
   4. Render del universo (nodos + relaciones)
   5. Cámara: pan / zoom
   6. Búsqueda y filtros
   7. Modal de detalle
   8. Arranque
   ========================================================= */

/* =========================================================
   1. DATOS DEL UNIVERSO
   -----------------------------------------------------------
   Para agregar un elemento nuevo, copia un objeto y cámbialo.
   - id: número único
   - nombre, categoria, imagen, descripcion, historia
   - relaciones: ids de otros elementos con los que conecta
   - anillo: qué tan lejos del centro aparece (1 = más cerca)
   ========================================================= */
const FOTOS_DRIVE = [
  "9d4316ee-7676-44f1-916b-08934966a985.jpg",
  "dbbfc2ef-4b30-415e-b700-73ca5af162df.jpg",
  "IMG_20250723_141337_867.webp",
  "IMG_20250727_144055.jpg",
  "IMG_20250922_160712_HDR.jpg",
  "IMG_20250922_160742_HDR.jpg",
  "IMG_20260317_170939_HDR~2.jpg",
  "IMG_20260317_171017_HDR~2.jpg",
  "IMG_20260417_185655_HDR~2.jpg",
  "IMG-20250922-WA0110~2.jpg",
  "IMG-20250922-WA0113~2.jpg",
  "IMG-20250922-WA0117~2.jpg",
  "IMG-20251130-WA0041.jpg",
  "IMG-20251202-WA0160.jpg",
  "IMG-20251208-WA0093.jpg",
  "IMG-20251208-WA0117.jpg",
  "IMG-20251208-WA0121.jpg",
  "IMG-20251215-WA0097.jpg",
  "IMG-20251215-WA0098.jpg",
  "IMG-20251215-WA0099.jpg",
  "IMG-20251224-WA0066~2.jpg",
  "IMG-20251224-WA0067~2.jpg",
  "IMG-20251224-WA0068.jpg",
  "IMG-20251224-WA0069.jpg",
  "IMG-20251224-WA0071.jpg",
  "IMG-20251224-WA0072.jpg",
  "IMG-20251224-WA0076~2.jpg",
  "IMG-20251224-WA0077~2.jpg",
  "IMG-20260111-WA0055 - Copia.jpg",
  "IMG-20260111-WA0062.jpg",
  "IMG-20260111-WA0066.jpg",
  "IMG-20260502-WA0073~2.jpg",
];

const FRASES_RECUERDOS = [
  "Te amo demasiado; eres lo mejor que me ha pasado.",
  "Cada momento contigo hace más bonito mi universo.",
  "Gracias por existir y por compartir tu vida conmigo.",
  "Contigo, hasta los días normales se sienten especiales.",
  "Eres mi lugar favorito, mi calma y mi alegría.",
];

const universo = [
  {
    id: 1,
    nombre: "Nuestro Universo",
    categoria: "mundo",
    imagen: "assets/images/IMG_20250527_192033_224.webp",
    descripcion: "Siempre serás mi luz en mi oscuridad R&E 11/04/25",
    historia: "Este es el centro de nuestra pequeña galaxia. Cambia esta imagen y este texto por lo que ustedes quieran: una foto especial, una frase que digan siempre, o el día exacto en que empezó todo.",
    relaciones: [8],
    anillo: 0,
  },
  {
    id: 8,
    nombre: "Nuestras fotos",
    categoria: "coleccion",
    imagen: "assets/images/IMG_20250527_192223_512.webp",
    descripcion: "Te amo demasiado; eres lo mejor que me ha pasado.",
    historia: "Agrega aquí una colección de imágenes favoritas, o enlázala a más nodos tipo 'imagen'.",
    relaciones: [1],
    anillo: 2,
  },
  ...FOTOS_DRIVE.map((nombre, indice) => ({
    id: 100 + indice,
    nombre: `Recuerdo ${String(indice + 1).padStart(2, "0")}`,
    categoria: "imagen",
    imagen: `assets/images/${nombre}`,
    descripcion: FRASES_RECUERDOS[indice % FRASES_RECUERDOS.length],
    historia: `Archivo original: ${nombre}`,
    relaciones: [8],
    anillo: 3 + (indice % 2),
  })),
];

/* =========================================================
   2. CONFIGURACIÓN DE CATEGORÍAS
   ========================================================= */
const CATEGORIAS = {
  mundo:      { etiqueta: "Mundos",      icono: "🌌", color: "#9d8cf0", tam: 110 },
  planeta:    { etiqueta: "Planetas",    icono: "🪐", color: "#6fb3e0", tam: 90 },
  lugar:      { etiqueta: "Lugares",     icono: "🏙️", color: "#7bd3b0", tam: 82 },
  personaje:  { etiqueta: "Personajes",  icono: "👤", color: "#e79fc4", tam: 88 },
  grupo:      { etiqueta: "Grupos",      icono: "🧑‍🤝‍🧑", color: "#e79fc4", tam: 82 },
  historia:   { etiqueta: "Historias",   icono: "📖", color: "#f0c988", tam: 86 },
  evento:     { etiqueta: "Eventos",     icono: "⚔️", color: "#f0a06e", tam: 78 },
  logro:      { etiqueta: "Logros",      icono: "🏆", color: "#f0c988", tam: 74 },
  imagen:     { etiqueta: "Imágenes",    icono: "🖼️", color: "#b7b3d6", tam: 70 },
  coleccion:  { etiqueta: "Colecciones", icono: "📁", color: "#b7b3d6", tam: 76 },
};

/* =========================================================
   3. FONDO DE ESTRELLAS (canvas, con parallax suave)
   ========================================================= */
function crearFondoEstrellas(canvas, cantidad = 160) {
  const ctx = canvas.getContext("2d");
  let estrellas = [];
  let ancho, alto;

  function medir() {
    ancho = canvas.width = canvas.offsetWidth * devicePixelRatio;
    alto = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function generar() {
    estrellas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: Math.random() * 1.6 * devicePixelRatio + 0.3,
      brillo: Math.random(),
      velocidad: Math.random() * 0.015 + 0.004,
      fase: Math.random() * Math.PI * 2,
    }));
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    for (const e of estrellas) {
      e.fase += e.velocidad;
      const opacidad = 0.35 + Math.abs(Math.sin(e.fase)) * 0.65;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 241, 251, ${opacidad})`;
      ctx.fill();
    }
    requestAnimationFrame(dibujar);
  }

  medir();
  generar();
  dibujar();
  window.addEventListener("resize", () => { medir(); generar(); });
}

/* =========================================================
   4. RENDER DEL UNIVERSO
   ========================================================= */
const capaNodos = document.getElementById("capa-nodos");
const svgRelaciones = document.getElementById("svg-relaciones");
const lienzo = document.getElementById("lienzo");

const ANCHO_LIENZO = 1600;
const ALTO_LIENZO = 1200;
const CENTRO = { x: ANCHO_LIENZO / 2, y: ALTO_LIENZO / 2 };

let posiciones = {}; // id -> {x, y}

function calcularPosiciones() {
  // Agrupa por anillo y reparte cada anillo en un círculo,
  // con un pequeño offset determinístico para que no se vea
  // perfectamente simétrico (más orgánico).
  const anillos = {};
  universo.forEach((el) => {
    const a = el.anillo ?? 1;
    (anillos[a] = anillos[a] || []).push(el);
  });

  Object.entries(anillos).forEach(([anillo, elementos]) => {
    const radios = { 0: 0, 2: 250, 3: 390, 4: 520 };
    const radio = radios[Number(anillo)] ?? Number(anillo) * 130;
    const n = elementos.length;
    elementos.forEach((el, i) => {
      if (Number(anillo) === 0) {
        posiciones[el.id] = { x: CENTRO.x, y: CENTRO.y };
        return;
      }
      const anguloBase = (Math.PI * 2 * i) / n;
      const offset = (el.id % 5) * 0.06; // variación sutil
      const angulo = anguloBase + offset;
      posiciones[el.id] = {
        x: CENTRO.x + Math.cos(angulo) * radio,
        y: CENTRO.y + Math.sin(angulo) * radio,
      };
    });
  });
}

function renderNodos() {
  capaNodos.innerHTML = "";
  universo.forEach((el) => {
    const cfg = CATEGORIAS[el.categoria] || CATEGORIAS.imagen;
    const pos = posiciones[el.id];

    const nodo = document.createElement("div");
    nodo.className = "nodo";
    nodo.dataset.id = el.id;
    nodo.dataset.categoria = el.categoria;
    nodo.style.left = pos.x + "px";
    nodo.style.top = pos.y + "px";
    nodo.style.animationDelay = (el.id % 6) * 0.06 + "s";

    const esfera = document.createElement("div");
    esfera.className = "nodo-esfera";
    esfera.style.setProperty("--color-cat", cfg.color);
    esfera.style.setProperty("--tam", cfg.tam + "px");

    if (el.imagen) {
      const img = document.createElement("img");
      img.src = el.imagen;
      img.alt = el.nombre;
      img.loading = "lazy";
      img.onerror = () => { img.remove(); esfera.innerHTML = `<span class="nodo-icono">${cfg.icono}</span>`; };
      esfera.appendChild(img);
    } else {
      esfera.innerHTML = `<span class="nodo-icono">${cfg.icono}</span>`;
    }

    const etiqueta = document.createElement("span");
    etiqueta.className = "nodo-etiqueta";
    etiqueta.textContent = el.nombre;

    nodo.appendChild(esfera);
    nodo.appendChild(etiqueta);
    nodo.addEventListener("click", () => abrirModal(el.id));
    capaNodos.appendChild(nodo);
  });
}

function renderRelaciones() {
  svgRelaciones.innerHTML = "";
  svgRelaciones.setAttribute("width", ANCHO_LIENZO);
  svgRelaciones.setAttribute("height", ALTO_LIENZO);
}

/* =========================================================
   5. CÁMARA: pan y zoom sobre #lienzo
   ========================================================= */
const escenario = document.getElementById("escenario");
const camara = { x: 0, y: 0, escala: 1 };

function aplicarCamara() {
  lienzo.style.transform = `translate(${camara.x}px, ${camara.y}px) scale(${camara.escala})`;
}

function centrarCamara() {
  const rect = escenario.getBoundingClientRect();
  camara.escala = Math.min(1, rect.width / (ANCHO_LIENZO * 0.62));
  camara.x = rect.width / 2 - CENTRO.x * camara.escala;
  camara.y = rect.height / 2 - CENTRO.y * camara.escala;
  aplicarCamara();
}

function iniciarControlesCamara() {
  let arrastrando = false;
  let inicio = { x: 0, y: 0 };
  let camaraInicio = { x: 0, y: 0 };

  const empezar = (x, y) => {
    arrastrando = true;
    inicio = { x, y };
    camaraInicio = { x: camara.x, y: camara.y };
    escenario.classList.add("arrastrando");
  };
  const mover = (x, y) => {
    if (!arrastrando) return;
    camara.x = camaraInicio.x + (x - inicio.x);
    camara.y = camaraInicio.y + (y - inicio.y);
    aplicarCamara();
  };
  const terminar = () => {
    arrastrando = false;
    escenario.classList.remove("arrastrando");
  };

  escenario.addEventListener("mousedown", (e) => empezar(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => mover(e.clientX, e.clientY));
  window.addEventListener("mouseup", terminar);

  escenario.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    empezar(t.clientX, t.clientY);
  }, { passive: true });
  escenario.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    mover(t.clientX, t.clientY);
  }, { passive: true });
  escenario.addEventListener("touchend", terminar);

  escenario.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    zoomEn(delta, e.clientX, e.clientY);
  }, { passive: false });

  document.getElementById("btn-zoom-in").addEventListener("click", () => {
    const rect = escenario.getBoundingClientRect();
    zoomEn(0.18, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  document.getElementById("btn-zoom-out").addEventListener("click", () => {
    const rect = escenario.getBoundingClientRect();
    zoomEn(-0.18, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  document.getElementById("btn-zoom-reset").addEventListener("click", centrarCamara);
}

function zoomEn(delta, puntoX, puntoY) {
  const rect = escenario.getBoundingClientRect();
  const px = puntoX - rect.left;
  const py = puntoY - rect.top;

  const escalaAnterior = camara.escala;
  let nuevaEscala = escalaAnterior * (1 + delta);
  nuevaEscala = Math.min(2.2, Math.max(0.35, nuevaEscala));

  // Mantiene el punto bajo el cursor fijo mientras hace zoom
  camara.x = px - ((px - camara.x) / escalaAnterior) * nuevaEscala;
  camara.y = py - ((py - camara.y) / escalaAnterior) * nuevaEscala;
  camara.escala = nuevaEscala;
  aplicarCamara();
}

/* =========================================================
   6. BÚSQUEDA Y FILTROS
   ========================================================= */
let filtroActivo = "todos";
let textoBusqueda = "";

function renderFiltros() {
  const contenedor = document.getElementById("filtros");
  const categoriasUsadas = [...new Set(universo.map((e) => e.categoria))];

  const chipTodos = document.createElement("button");
  chipTodos.className = "filtro-chip activo";
  chipTodos.textContent = "Todos";
  chipTodos.dataset.cat = "todos";
  contenedor.appendChild(chipTodos);

  categoriasUsadas.forEach((cat) => {
    const cfg = CATEGORIAS[cat];
    if (!cfg) return;
    const chip = document.createElement("button");
    chip.className = "filtro-chip";
    chip.textContent = `${cfg.icono} ${cfg.etiqueta}`;
    chip.dataset.cat = cat;
    chip.style.setProperty("--chip-color", cfg.color);
    contenedor.appendChild(chip);
  });

  contenedor.addEventListener("click", (e) => {
    const chip = e.target.closest(".filtro-chip");
    if (!chip) return;
    filtroActivo = chip.dataset.cat;
    contenedor.querySelectorAll(".filtro-chip").forEach((c) => c.classList.toggle("activo", c === chip));
    aplicarFiltros();
  });
}

function aplicarFiltros() {
  const nodos = capaNodos.querySelectorAll(".nodo");
  nodos.forEach((nodo) => {
    const el = universo.find((u) => String(u.id) === nodo.dataset.id);
    const coincideCategoria = filtroActivo === "todos" || el.categoria === filtroActivo;
    const coincideTexto =
      !textoBusqueda ||
      el.nombre.toLowerCase().includes(textoBusqueda) ||
      (el.descripcion || "").toLowerCase().includes(textoBusqueda);
    nodo.classList.toggle("atenuado", !(coincideCategoria && coincideTexto));
  });
}

function iniciarBusqueda() {
  const input = document.getElementById("input-buscar");
  input.addEventListener("input", () => {
    textoBusqueda = input.value.trim().toLowerCase();
    aplicarFiltros();
  });
}

/* =========================================================
   7. MODAL DE DETALLE
   ========================================================= */
const modal = document.getElementById("modal");

function abrirModal(id) {
  const el = universo.find((u) => u.id === id);
  if (!el) return;
  const cfg = CATEGORIAS[el.categoria] || CATEGORIAS.imagen;

  document.getElementById("modal-imagen").src = el.imagen || "";
  document.getElementById("modal-imagen").alt = el.nombre;
  document.getElementById("modal-descripcion").textContent = el.descripcion || "";

  const relacionesWrap = document.getElementById("modal-relaciones-wrap");
  const relacionesCont = document.getElementById("modal-relaciones");
  relacionesCont.innerHTML = "";
  const relacionados = (el.relaciones || []).map((rid) => universo.find((u) => u.id === rid)).filter(Boolean);
  if (relacionados.length) {
    relacionesWrap.classList.remove("oculto");
    relacionados.forEach((rel) => {
      const chip = document.createElement("button");
      chip.className = "chip-relacion";
      const cfgRel = CATEGORIAS[rel.categoria];
      chip.textContent = `${cfgRel ? cfgRel.icono : "✨"} ${rel.nombre}`;
      chip.addEventListener("click", () => abrirModal(rel.id));
      relacionesCont.appendChild(chip);
    });
  } else {
    relacionesWrap.classList.add("oculto");
  }

  modal.classList.remove("oculto");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  modal.classList.add("oculto");
  document.body.style.overflow = "";
}

function iniciarModal() {
  document.getElementById("btn-cerrar-modal").addEventListener("click", cerrarModal);
  document.getElementById("modal-fondo").addEventListener("click", cerrarModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarModal();
      cerrarImagenGrande();
    }
  });

  // Imagen ampliada
  const imagenGrande = document.getElementById("modal-imagen-grande");
  document.getElementById("modal-imagen").addEventListener("click", () => {
    const src = document.getElementById("modal-imagen").src;
    document.getElementById("imagen-grande").src = src;
    imagenGrande.classList.remove("oculto");
  });
  imagenGrande.addEventListener("click", cerrarImagenGrande);
}

function cerrarImagenGrande() {
  document.getElementById("modal-imagen-grande").classList.add("oculto");
}

/* =========================================================
   8. ARRANQUE
   ========================================================= */
function iniciarPantallaEntrada() {
  crearFondoEstrellas(document.getElementById("estrellas-entrada"), 140);

  document.getElementById("btn-entrar").addEventListener("click", () => {
    const entrada = document.getElementById("pantalla-entrada");
    const app = document.getElementById("universo-app");
    entrada.classList.add("saliendo");
    setTimeout(() => {
      entrada.classList.add("oculto");
      app.classList.remove("oculto");
      centrarCamara();
    }, 900);
  });

  document.getElementById("btn-volver").addEventListener("click", () => {
    document.getElementById("universo-app").classList.add("oculto");
    const entrada = document.getElementById("pantalla-entrada");
    entrada.classList.remove("saliendo", "oculto");
  });
}

function iniciarApp() {
  calcularPosiciones();
  renderRelaciones();
  renderNodos();
  renderFiltros();
  iniciarBusqueda();
  iniciarModal();
  iniciarControlesCamara();
  crearFondoEstrellas(document.getElementById("estrellas-fondo"), 200);
  iniciarPantallaEntrada();
  window.addEventListener("resize", centrarCamara);
}

document.addEventListener("DOMContentLoaded", iniciarApp);
