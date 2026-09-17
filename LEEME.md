# Nuestro Universo 🌌

Un pequeño universo interactivo hecho en HTML, CSS y JavaScript puro (sin frameworks) para regalar.

## Cómo verlo

Abre `index.html` en cualquier navegador (doble clic funciona). No necesita instalar nada.
Si quieres subirlo a internet para mandarle el link, puedes usar servicios gratuitos como Netlify, Vercel o GitHub Pages: solo arrastras esta carpeta.

## Cómo personalizarlo (lo importante)

Todo el contenido vive en un solo lugar: **`js/script.js`**, en la sección `1. DATOS DEL UNIVERSO`, dentro del arreglo `universo`.

Cada elemento se ve así:

```javascript
{
  id: 4,
  nombre: "Ella",
  categoria: "personaje",
  imagen: "assets/images/placeholder-ella.jpg",
  descripcion: "Protagonista de este universo.",
  historia: "Escribe aquí lo que más admiras de ella...",
  relaciones: [2, 3, 5, 7],
  anillo: 1,
}
```

- **id**: un número único, no lo repitas.
- **nombre**: lo que aparece bajo la estrella y en el modal.
- **categoria**: una de `mundo, planeta, lugar, personaje, grupo, historia, evento, logro, imagen, coleccion` (puedes agregar más categorías en `CATEGORIAS`, en `script.js`).
- **imagen**: ruta a un archivo dentro de `assets/images/`. Si no existe o no la pones, se muestra el ícono de la categoría en su lugar (no rompe nada).
- **descripcion**: una frase corta.
- **historia**: el texto largo que aparece al abrir el nodo.
- **relaciones**: lista de `id` de otros elementos con los que quieres que se vea conectado con una línea.
- **anillo**: `0` = centro, `1` = primer círculo, `2` = segundo círculo, etc. Controla qué tan lejos aparece del centro.

### Para agregar un elemento nuevo
1. Copia uno de los objetos existentes.
2. Pégalo dentro del arreglo `universo` (antes del `];` final).
3. Cambia el `id` por uno que no exista todavía.
4. Cambia el resto de los datos.
5. Guarda y recarga la página.

### Para agregar tus propias fotos
1. Copia tus imágenes dentro de `assets/images/`.
2. En cada elemento, cambia `imagen: "assets/images/tu-foto.jpg"`.

### Ideas de contenido para tu novia
- Un nodo `mundo` central con una foto de los dos.
- Nodos `historia` para: cómo se conocieron, la primera cita, la primera vez que dijeron "te amo".
- Nodos `lugar` para los sitios importantes.
- Nodos `logro` para cada aniversario o meta cumplida juntos.
- Nodos `coleccion` que conecten a varias fotos.
- Puedes editar los textos de la pantalla de entrada en `index.html`, dentro de `<section id="pantalla-entrada">` (el título "Nuestro Universo" y la frase de bienvenida).

## Estructura de archivos

```
proyecto/
├── index.html          → estructura de la página
├── css/styles.css       → todo el diseño visual
├── js/script.js         → datos + interactividad
└── assets/
    ├── images/          → aquí van tus fotos
    └── icons/           → (opcional) íconos propios
```

## Funciones incluidas
- Pantalla de entrada con animación.
- Universo navegable: arrastra con el mouse/dedo, zoom con la rueda o pellizco.
- Buscador por nombre o descripción.
- Filtros por categoría.
- Modal de detalle con imagen, historia y elementos relacionados (clic para saltar entre ellos).
- Imagen ampliable a pantalla completa.
- Diseño responsive (PC, tablet, celular).
- Fondo de estrellas animado.
