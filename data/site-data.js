/*
 * Mi Semestre shared registry.
 *
 * This file contains metadata only. Academic bodies remain in the existing
 * resource HTML files and are referenced by their stable hrefs below.
 */
(function () {
  window.MI_SEMESTRE_DATA = {
    courses: [
      {
        id: "maye1",
        shortName: "MAyE I",
        name: "Matemáticas para la Administración y Economía I",
        status: "active"
      },
      {
        id: "contabilidad",
        shortName: "Contabilidad",
        name: "Contabilidad General",
        status: "active"
      },
      {
        id: "economia",
        shortName: "Economía",
        name: "Introducción a la Economía",
        status: "active"
      },
      {
        id: "administracion",
        shortName: "Administración",
        name: "Administración",
        status: "active"
      },
      {
        id: "computacion",
        shortName: "Computación",
        name: "Computación",
        status: "active"
      },
      {
        id: "ramo6",
        shortName: "Ramo 6",
        name: "Ramo 6 (pendiente)",
        status: "unnamed"
      },
      {
        id: "ramo7",
        shortName: "Ramo 7",
        name: "Ramo 7 (pendiente)",
        status: "unnamed"
      }
    ],

    resources: [
      {
        id: "maye1-pep2-limites",
        courseId: "maye1",
        title: "📘 Resumen y Plan de Estudio — PEP 2",
        description: "Límites, límites laterales, límites al infinito, Teorema del Sándwich, cambio de variable, límites exponenciales y logarítmicos. Incluye 16 ejercicios resueltos y plan de repaso día a día.",
        type: "summary",
        href: "courses/maye1/pep2.html",
        status: "published",
        displayOrder: 10,
        provenance: [
          { sourceId: "maye1-clases-18-20", relation: "based-on" },
          { sourceId: "maye1-fechas-temarios", relation: "based-on" }
        ],
        assessmentIds: ["maye1-pep2"],
        capabilities: ["summary", "exercises", "study-plan", "formula-sheet"]
      },
      {
        id: "maye1-compendio",
        courseId: "maye1",
        title: "📚 Compendio MAyEI I — Clases, Controles y Guías",
        description: "Consolidado de 14 documentos con navegación lateral y buscador: 6 Clases (función logarítmica, preliminares de límite, álgebra de límites, teoremas de límite, continuidad y asíntotas), 5 Controles resueltos y 3 Guías de ejercicios (repaso de límites, sandwich y exponenciales, preparatoria PEP 2).",
        type: "compendium",
        href: "courses/maye1/compendio-mayei.html",
        status: "published",
        displayOrder: 20,
        provenance: [
          { sourceId: "maye1-14-documentos-catedra", relation: "based-on" }
        ],
        assessmentIds: [],
        capabilities: ["summary", "search", "exercises", "solutions", "navigation"]
      },
      {
        id: "maye1-dominio-limites",
        courseId: "maye1",
        title: "📐 Dominio de Límites — Teoría, arquetipos y práctica",
        description: "Formulario y errores frecuentes, 6 arquetipos de resolución, ejercicios resueltos con comentario paso a paso, 12 fichas de estudio y 4 problemas de práctica con soluciones.",
        type: "study-kit",
        href: "courses/maye1/dominio-limites.html",
        status: "published",
        displayOrder: 30,
        provenance: [
          { sourceId: "maye1-guia-preparatoria-pep2", relation: "based-on" }
        ],
        assessmentIds: ["maye1-pep2"],
        capabilities: ["summary", "formula-sheet", "flashcards", "exercises", "solutions", "quiz"]
      },

      {
        id: "economia-pep2-clases-1-4",
        courseId: "economia",
        title: "📗 Resumen PEP 2 — Clases 1 a 4 (completo)",
        description: "Unidad 1 completa (fundamentos, método científico, costo de oportunidad, FPP) y Unidad 2 completa (mercado, demanda, oferta, precio, equilibrio y shocks). Ejercicios, mapa conceptual, glosario interactivo, plan de repaso y autoevaluación.",
        type: "summary",
        href: "courses/economia/pep2.html",
        status: "published",
        displayOrder: 10,
        provenance: [
          { sourceId: "economia-diapositivas-clases-1-4", relation: "based-on" }
        ],
        assessmentIds: ["economia-pep2"],
        capabilities: ["summary", "exercises", "concept-map", "flashcards", "study-plan", "quiz"]
      },
      {
        id: "economia-pep2-clases-4-8",
        courseId: "economia",
        title: "📘 Resumen PEP 2 — Clases 4 a 8 (Unidad 2 + Unidad 3)",
        description: "Unidad 2 completa (mercado, consumidor, productor, elasticidad y bienestar) y Unidad 3: macroeconomía (PIB, desempleo, productividad y crecimiento). Ejercicios, guía integradora paso a paso con pauta docente, mapa conceptual, glosario y autoevaluación.",
        type: "summary",
        href: "courses/economia/pep2-clase4-8.html",
        status: "published",
        displayOrder: 20,
        provenance: [
          { sourceId: "economia-diapositivas-clases-4-8", relation: "based-on" },
          { sourceId: "economia-guia-oficial-clases-4-8", relation: "includes" }
        ],
        assessmentIds: ["economia-pep2"],
        capabilities: ["summary", "exercises", "concept-map", "flashcards", "study-plan", "quiz"]
      },
      {
        id: "economia-guia-paso-a-paso",
        courseId: "economia",
        title: "✍️ Guía Paso a Paso — PEP 2 (Clase 4 a 8)",
        description: "Guía oficial del Departamento de Economía USACH con pauta docente completa: 24 preguntas de alternativas, 18 de verdadero/falso y 8 problemas de desarrollo, cada uno con respuesta explicada y criterio de corrección. Formato interactivo: responde antes de revisar la solución.",
        type: "official-guide",
        href: "courses/economia/guia-paso-a-paso.html",
        status: "published",
        displayOrder: 30,
        provenance: [
          { sourceId: "economia-guia-oficial-clases-4-8", relation: "official" }
        ],
        assessmentIds: ["economia-pep2"],
        capabilities: ["exercises", "solutions", "quiz", "progress"]
      },
      {
        id: "economia-pep2-parcial",
        courseId: "economia",
        title: "📄 Resumen PEP 2 — Clases 3 y 4 (versión anterior)",
        description: "Versión previa y más acotada del resumen: costo de oportunidad y FPP, mercado, demanda y oferta. Reemplazada por la versión completa de arriba, se deja disponible por si quieres una guía más corta.",
        type: "summary",
        href: "courses/economia/pep2-parcial.html",
        status: "archived",
        displayOrder: 40,
        provenance: [
          { sourceId: "economia-diapositivas-clases-3-4", relation: "based-on" }
        ],
        assessmentIds: ["economia-pep2"],
        capabilities: ["summary", "exercises", "concept-map", "flashcards", "study-plan", "quiz"]
      },

      {
        id: "contabilidad-kit-estudio",
        courseId: "contabilidad",
        title: "🗂️ Kit de Estudio — Ajustes de Cierre y PPE",
        description: "Resumen por capas, flashcards, explicaciones estilo Feynman, test de autoevaluación con clave y glosario. Cubre regularizaciones periódicas (devengo, estimaciones, NIC 21) y NIC 16 (reconocimiento, depreciación y baja de PPE).",
        type: "study-kit",
        href: "courses/contabilidad/kit-estudio.html",
        status: "published",
        displayOrder: 10,
        provenance: [
          { sourceId: "contabilidad-material-catedra", relation: "based-on" },
          { sourceId: "contabilidad-normas", relation: "reference" }
        ],
        assessmentIds: [],
        capabilities: ["summary", "flashcards", "quiz", "glossary", "feynman"]
      },
      {
        id: "contabilidad-solucionario-regularizaciones",
        courseId: "contabilidad",
        title: "✅ Solucionario — Guía de Regularizaciones",
        description: "Desarrollo paso a paso de los 8 bloques de ejercicios: devengos con IVA, intereses, sueldos, moneda extranjera, depreciación, provisiones, deudores incobrables y el caso integrado.",
        type: "solution-manual",
        href: "courses/contabilidad/solucionario.html",
        status: "published",
        displayOrder: 20,
        provenance: [
          { sourceId: "contabilidad-guia-regularizaciones", relation: "based-on" },
          { sourceId: "contabilidad-normas", relation: "reference" }
        ],
        assessmentIds: [],
        capabilities: ["exercises", "solutions"]
      },
      {
        id: "contabilidad-solucionario-pep2",
        courseId: "contabilidad",
        title: "📝 Solucionario PEP 2 — Guía completa",
        description: "Términos pareados, complete la frase, selección múltiple y verdadero/falso, más 6 casos resueltos paso a paso: remuneraciones, cierre de IVA, PPE (mejora, depreciación y revalorización), baja por venta, regularizaciones y un caso integrado.",
        type: "solution-manual",
        href: "courses/contabilidad/solucionario-pep2.html",
        status: "published",
        displayOrder: 30,
        provenance: [
          { sourceId: "contabilidad-guia-preparacion-pep2", relation: "based-on" },
          { sourceId: "contabilidad-normas", relation: "reference" }
        ],
        assessmentIds: ["contabilidad-pep2"],
        capabilities: ["exercises", "solutions", "quiz"]
      },

      {
        id: "administracion-guia-robbins",
        courseId: "administracion",
        title: "📘 Guía de Estudio Interactiva — Robbins + Liderazgo",
        description: "Panel por capítulo con resumen, flashcards y quiz. Cap. 11–15 (Robbins) más la Sesión 21 · Liderazgo de la administración (Lægaard & Vest). Guarda tu progreso automáticamente en el navegador (modo oscuro incluido).",
        type: "interactive-guide",
        href: "courses/administracion/guia.html",
        status: "published",
        displayOrder: 10,
        provenance: [
          { sourceId: "administracion-robbins", relation: "based-on" },
          { sourceId: "administracion-organizational-theory", relation: "based-on" }
        ],
        assessmentIds: [],
        capabilities: ["summary", "flashcards", "quiz", "progress", "dark-mode"]
      },
      {
        id: "administracion-chiavenato-cap1",
        courseId: "administracion",
        title: "📘 Lección de estudio — Chiavenato, capítulo 1",
        description: "Resumen, explicaciones, mapa conceptual, tarjetas, práctica, quiz y glosario con páginas de origen.",
        type: "study-kit",
        href: "courses/administracion/capitulo-1.html",
        status: "published",
        displayOrder: 20,
        provenance: [{ sourceId: "administracion-chiavenato", relation: "based-on" }],
        assessmentIds: [],
        capabilities: ["summary", "concept-map", "flashcards", "exercises", "quiz", "glossary"]
      },

      {
        id: "computacion-guia-trabajo-final-r",
        courseId: "computacion",
        title: "💻 Guía de estudio — Trabajo Final R 2026",
        description: "Flujo completo del trabajo en R: librerías, importar Excel, limpieza de datos, agrupar por sede, gráfico de barras, exportar y subir a uvirtual. Incluye chuleta de funciones, errores comunes y checklist final.",
        type: "interactive-guide",
        href: "courses/computacion/guia.html",
        status: "published",
        displayOrder: 10,
        provenance: [
          { sourceId: "computacion-apunte-r-taller", relation: "based-on" },
          { sourceId: "computacion-sesion-14-agosto", relation: "based-on" },
          { sourceId: "computacion-enunciado-trabajo-final-r-2026", relation: "based-on" }
        ],
        assessmentIds: ["computacion-trabajo-final-r-2026"],
        capabilities: ["summary", "code", "checklist", "practice"]
      }
    ],

    assessments: [
      {
        id: "maye1-pep2",
        courseId: "maye1",
        title: "PEP 2",
        kind: "pep",
        date: "2026-08-26",
        status: "documented",
        resourceIds: ["maye1-pep2-limites", "maye1-dominio-limites"]
      },
      {
        id: "economia-pep2",
        courseId: "economia",
        title: "PEP 2",
        kind: "pep",
        date: "2026-08-25",
        status: "documented",
        resourceIds: [
          "economia-pep2-clases-1-4",
          "economia-pep2-clases-4-8",
          "economia-guia-paso-a-paso",
          "economia-pep2-parcial"
        ]
      },
      {
        id: "contabilidad-pep2",
        courseId: "contabilidad",
        title: "PEP 2",
        kind: "pep",
        date: null,
        status: "undated",
        resourceIds: ["contabilidad-solucionario-pep2"]
      },
      {
        id: "computacion-trabajo-final-r-2026",
        courseId: "computacion",
        title: "Trabajo Final R 2026",
        kind: "assignment",
        date: null,
        status: "undated",
        resourceIds: ["computacion-guia-trabajo-final-r"]
      }
    ],

    sources: [
      {
        id: "maye1-clases-18-20",
        courseId: "maye1",
        kind: "lecture-material",
        title: "Clases 18, 19 y 20",
        authors: [],
        institution: "Coordinación de Matemática, MAyE I"
      },
      {
        id: "maye1-fechas-temarios",
        courseId: "maye1",
        kind: "course-planning",
        title: "Fechas y temarios",
        authors: [],
        institution: "Coordinación de Matemática"
      },
      {
        id: "maye1-14-documentos-catedra",
        courseId: "maye1",
        kind: "lecture-material",
        title: "14 documentos de cátedra",
        authors: [],
        institution: "USACH · Departamento de Matemática y C.C."
      },
      {
        id: "maye1-guia-preparatoria-pep2",
        courseId: "maye1",
        kind: "official-guide",
        title: "Guía preparatoria PEP 2",
        authors: [],
        institution: null
      },
      {
        id: "economia-diapositivas-clases-1-4",
        courseId: "economia",
        kind: "lecture-material",
        title: "Diapositivas de Clases 1 a 4",
        authors: [],
        institution: "Departamento de Economía, USACH"
      },
      {
        id: "economia-diapositivas-clases-4-8",
        courseId: "economia",
        kind: "lecture-material",
        title: "Diapositivas de Clase 4 a Clase 8",
        authors: [],
        institution: "Departamento de Economía, USACH"
      },
      {
        id: "economia-guia-oficial-clases-4-8",
        courseId: "economia",
        kind: "official-guide",
        title: "Guía oficial del Departamento de Economía USACH para Clase 4 a Clase 8",
        authors: ["Robinson Dettoni", "Cliff Bahamondes", "José Vásquez"],
        institution: "Departamento de Economía, USACH"
      },
      {
        id: "economia-diapositivas-clases-3-4",
        courseId: "economia",
        kind: "lecture-material",
        title: "Diapositivas de Clase 3 y Clase 4",
        authors: [],
        institution: "Departamento de Economía, USACH"
      },
      {
        id: "contabilidad-material-catedra",
        courseId: "contabilidad",
        kind: "lecture-material",
        title: "Material de cátedra USACH",
        authors: [],
        institution: "USACH"
      },
      {
        id: "contabilidad-guia-regularizaciones",
        courseId: "contabilidad",
        kind: "official-guide",
        title: "Guía de Regularizaciones Periódicas USACH",
        authors: [],
        institution: "USACH"
      },
      {
        id: "contabilidad-guia-preparacion-pep2",
        courseId: "contabilidad",
        kind: "official-guide",
        title: "Guía de preparación PEP 2",
        authors: [],
        institution: "USACH"
      },
      {
        id: "contabilidad-normas",
        courseId: "contabilidad",
        kind: "standards",
        title: "NIC 1 · NIC 16 · NIC 21 · NIC 37 · NIIF 9",
        authors: [],
        institution: null
      },
      {
        id: "administracion-robbins",
        courseId: "administracion",
        kind: "textbook",
        title: "Administración",
        authors: ["Robbins"],
        institution: null,
        edition: "13ª edición"
      },
      {
        id: "administracion-chiavenato",
        courseId: "administracion",
        kind: "textbook",
        title: "Introducción a la teoría general de la administración: una visión integral de la moderna administración de las organizaciones",
        authors: ["Idalberto Chiavenato"],
        institution: null,
        edition: "10ª edición"
      },
      {
        id: "administracion-organizational-theory",
        courseId: "administracion",
        kind: "textbook",
        title: "Organizational Theory",
        authors: ["Lægaard", "Vest"],
        institution: null
      },
      {
        id: "computacion-apunte-r-taller",
        courseId: "computacion",
        kind: "personal-notes",
        title: "Apunte R Taller",
        authors: [],
        institution: null
      },
      {
        id: "computacion-sesion-14-agosto",
        courseId: "computacion",
        kind: "personal-notes",
        title: "Sesión 14 agosto.R",
        authors: [],
        institution: null
      },
      {
        id: "computacion-enunciado-trabajo-final-r-2026",
        courseId: "computacion",
        kind: "assignment",
        title: "Enunciado del Trabajo Final R 2026",
        authors: [],
        institution: null
      }
    ]
  };
})();
