/* LessonBundle v1: pedagogical content from the verified Chiavenato Chapter 1 RAW. */
(function (root) {
  var bundle = {
    schemaVersion: 1,
    lessonId: "administracion-chiavenato-cap1",
    courseId: "administracion",
    title: "La administración y sus perspectivas",
    source: {
      sourceId: "administracion-chiavenato",
      sha256: "6b076dbd35e1150716f460ee7b28bc06a7b6dad7eb7541c190bd68872efbed47",
      printedPages: [7, 18],
      pdfPages: [22, 33]
    },
    sourceRefs: {
      objectives: { heading: "Objetivos de aprendizaje", printedPages: [7, 7], pdfPages: [22, 22] },
      content: { heading: "Contenido y objeto de estudio de la administración", printedPages: [8, 10], pdfPages: [23, 25] },
      concept: { heading: "Concepto de administración", printedPages: [8, 9], pdfPages: [23, 24] },
      science: { heading: "Figura 1.1. La administración como ciencia, tecnología y arte", printedPages: [10, 10], pdfPages: [25, 25] },
      emphases: { heading: "Cuadro 1.1. Las principales teorías administrativas y sus enfoques", printedPages: [10, 10], pdfPages: [25, 25] },
      theories: { heading: "Teorías de la administración", printedPages: [11, 11], pdfPages: [26, 26] },
      variables: { heading: "Situación actual de la teoría general de la administración", printedPages: [12, 12], pdfPages: [27, 27] },
      modern: { heading: "La administración en la sociedad moderna", printedPages: [12, 13], pdfPages: [27, 28] },
      future: { heading: "Perspectivas de la administración", printedPages: [13, 14], pdfPages: [28, 29] },
      coming: { heading: "Lo que viene", printedPages: [14, 14], pdfPages: [29, 29] },
      trends: { heading: "Las megatendencias", printedPages: [14, 16], pdfPages: [29, 31] },
      conclusions: { heading: "Conclusiones", printedPages: [17, 17], pdfPages: [32, 32] },
      glossary: { heading: "Glosario básico", printedPages: [17, 18], pdfPages: [32, 33] },
      roberto: { heading: "Las dificultades de Roberto", printedPages: [12, 12], pdfPages: [27, 27] }
    },
    overview: {
      text: "El capítulo presenta qué hace la administración, cómo la estudia la TGA y por qué sus enfoques cambian ante situaciones organizacionales distintas. Cierra con los desafíos que el cambio plantea a quienes administran.",
      refs: ["objectives", "concept", "variables", "future"]
    },
    objectives: [
      { id: "obj-definir", text: "Definir administración, teoría general de la administración y organización.", refs: ["objectives"] },
      { id: "obj-importancia", text: "Reconocer la importancia actual de la administración.", refs: ["objectives"] },
      { id: "obj-objeto", text: "Explicar el contenido y el objeto de estudio de la administración.", refs: ["objectives"] },
      { id: "obj-futuro", text: "Analizar sus perspectivas futuras.", refs: ["objectives"] }
    ],
    summary: [
      { id: "sum-proceso", title: "Qué hace", text: "La administración transforma objetivos organizacionales en acciones mediante planeación, organización, dirección y control de esfuerzos y recursos.", refs: ["content", "concept"] },
      { id: "sum-practica", title: "Cómo trabaja", text: "Reúne análisis apoyado en evidencia, técnicas aplicables y juicio creativo para atender situaciones concretas.", refs: ["content", "science"] },
      { id: "sum-teorias", title: "Cómo se estudia", text: "Las teorías administrativas ofrecen enfoques distintos; cada una destaca ciertas variables o problemas, según la situación y su época.", refs: ["emphases", "theories", "variables"] },
      { id: "sum-entorno", title: "Por qué importa", text: "Las organizaciones necesitan coordinar actividades, personas y recursos para alcanzar objetivos en un entorno competitivo y cambiante.", refs: ["modern", "conclusions"] },
      { id: "sum-futuro", title: "Qué cambia", text: "Crecimiento, competencia, tecnología, globalización y visibilidad aumentan la complejidad y la incertidumbre del trabajo administrativo.", refs: ["future", "coming"] }
    ],
    sections: [
      { id: "section-content", title: "Contenido y objeto de estudio", explanation: "El texto presenta la administración como un proceso orientado a objetivos. Implica coordinar personas y recursos, tomar decisiones y conducir actividades en toda la organización. No se reduce a ejecutar tareas aisladas: requiere integrar esfuerzos y adaptar las acciones a cada situación.", refs: ["content", "concept"] },
      { id: "section-theories", title: "Teorías de la administración", explanation: "Las teorías son maneras de interpretar problemas y orientar decisiones. El capítulo muestra que sus énfasis varían: tareas, estructura, personas, ambiente, tecnología y competitividad. Conocer más de un enfoque amplía las alternativas del administrador; ninguno se presenta como respuesta fija para toda situación.", refs: ["emphases", "theories"] },
      { id: "section-current", title: "Situación actual de la TGA", explanation: "La TGA estudia la interacción de seis variables básicas: tareas, estructura, personas, tecnología, ambiente y competitividad. Una modificación en una puede producir cambios en otras, por lo que conviene observar el conjunto y no cada variable de forma aislada.", refs: ["variables"] },
      { id: "section-modern", title: "Administración en la sociedad moderna", explanation: "Administrar aparece en organizaciones de distintos tipos. Cuando especialistas asumen responsabilidades de supervisión o dirección, necesitan coordinar el trabajo de otros y evaluar resultados además de dominar su especialidad.", refs: ["modern"] },
      { id: "section-future", title: "Perspectivas futuras", explanation: "El capítulo anticipa presiones por crecimiento, competencia, avances tecnológicos, globalización y mayor visibilidad pública. Esas condiciones vuelven menos previsible el trabajo administrativo y exigen observar el entorno, diagnosticar la situación y ajustar la organización.", refs: ["future", "coming", "trends"] }
    ],
    concepts: [
      { id: "admin-concepto-administracion", title: "Administración como proceso", explanation: "Coordina personas, recursos y acciones para alcanzar objetivos de la organización mediante planeación, organización, dirección y control.", refs: ["concept", "content"] },
      { id: "admin-ciencia-tecnologia-arte", title: "Ciencia, tecnología y arte", explanation: "Combina análisis de datos y evidencia, aplicación de técnicas y herramientas, y una respuesta creativa ante cada situación.", refs: ["content", "science"] },
      { id: "admin-teorias-enfasis", title: "Teorías y sus énfasis", explanation: "Las teorías administrativas destacan aspectos distintos y ayudan a interpretar problemas organizacionales en sus circunstancias.", refs: ["theories", "emphases"] },
      { id: "admin-seis-variables-tga", title: "Seis variables de la TGA", explanation: "Tareas, estructura, personas, tecnología, ambiente y competitividad interactúan; un cambio en una puede afectar a las demás.", refs: ["variables"] },
      { id: "admin-perspectivas", title: "Perspectivas de la administración", explanation: "Cambios rápidos, complejidad e incertidumbre hacen necesaria la coordinación y adaptación de las organizaciones.", refs: ["future", "coming"] }
    ],
    conceptMap: {
      nodes: [
        { id: "organization", label: "Organizaciones", refs: ["content"] },
        { id: "administration", label: "Administración", refs: ["concept"] },
        { id: "objectives", label: "Objetivos", refs: ["concept"] },
        { id: "tga", label: "TGA", refs: ["variables"] },
        { id: "variables", label: "Seis variables", refs: ["variables"] },
        { id: "theories", label: "Teorías", refs: ["theories"] },
        { id: "change", label: "Cambio e incertidumbre", refs: ["future", "coming"] }
      ],
      links: [
        { from: "organization", to: "administration", label: "requieren coordinación mediante", refs: ["content"] },
        { from: "administration", to: "objectives", label: "orienta recursos y esfuerzos hacia", refs: ["concept"] },
        { from: "tga", to: "variables", label: "estudia la interacción de", refs: ["variables"] },
        { from: "theories", to: "variables", label: "ponen énfasis en distintas", refs: ["emphases", "theories"] },
        { from: "administration", to: "change", label: "afronta", refs: ["future", "coming"] }
      ]
    },
    examples: [
      { id: "example-roberto", title: "Del saber técnico al trabajo con personas", scenario: "Un profesional puede analizar problemas con solvencia y aun así tener dificultades para explicar, orientar y trabajar con su equipo.", takeaway: "Administrar exige capacidades de coordinación y relación, además de conocimiento técnico.", refs: ["roberto", "modern"] },
      { id: "example-variables", title: "Aplicación didáctica: mirar el sistema completo", scenario: "Supón que una organización cambia su tecnología. Como ejercicio, examina qué podría cambiar en tareas, estructura y personas.", takeaway: "La pregunta aplica la idea del capítulo de que las variables se influyen entre sí; el caso no procede del libro.", refs: ["variables"] }
    ],
    flashcards: [
      { id: "flash-admin", front: "¿Qué persigue la administración?", back: "Coordinar acciones y recursos para alcanzar objetivos organizacionales.", refs: ["concept"] },
      { id: "flash-funciones", front: "¿Qué cuatro acciones aparecen en la descripción general del proceso administrativo?", back: "Planear, organizar, dirigir y controlar.", refs: ["content"] },
      { id: "flash-triple", front: "¿Por qué se presenta como ciencia, tecnología y arte?", back: "Analiza evidencia, aplica técnicas y requiere juicio creativo ante situaciones concretas.", refs: ["content", "science"] },
      { id: "flash-teorias", front: "¿Todas las teorías administrativas enfatizan lo mismo?", back: "No. Cada enfoque privilegia una o más variables o problemas.", refs: ["emphases", "theories"] },
      { id: "flash-variables", front: "¿Cuáles son las seis variables básicas de la TGA?", back: "Tareas, estructura, personas, tecnología, ambiente y competitividad.", refs: ["variables"] },
      { id: "flash-interaccion", front: "¿Qué ocurre si cambia una variable de la TGA?", back: "Puede afectar a las demás; se estudian como componentes interdependientes.", refs: ["variables"] },
      { id: "flash-futuro", front: "Nombra dos presiones futuras descritas en el capítulo.", back: "Por ejemplo, crecimiento de las organizaciones y avances tecnológicos; también competencia, globalización o mayor visibilidad.", refs: ["coming"] },
      { id: "flash-eficiencia", front: "¿Cómo distingue el glosario eficacia y eficiencia?", back: "Eficacia: alcanzar objetivos y resultados. Eficiencia: hacer las cosas correctamente.", refs: ["glossary"] }
    ],
    exercises: [
      { id: "exercise-variables", prompt: "Sin mirar: nombra las seis variables básicas de la TGA y explica qué puede ocurrir con las demás cuando cambia una.", check: "Tareas, estructura, personas, tecnología, ambiente y competitividad. El capítulo las describe como interdependientes: modificar una puede afectar a las otras.", refs: ["variables"] },
      { id: "exercise-process", prompt: "Explica con tus palabras cómo se transforman los objetivos de una organización en acciones administrativas.", check: "Una respuesta útil menciona planear, organizar, dirigir y controlar esfuerzos y recursos para alcanzar los objetivos, atendiendo a la situación.", refs: ["content", "concept"] },
      { id: "exercise-theories", prompt: "¿Por qué estudiar varias teorías administrativas en vez de aplicar siempre una sola?", check: "El capítulo presenta enfoques con énfasis distintos y señala que la situación y las circunstancias importan para elegir alternativas.", refs: ["theories", "emphases"] },
      { id: "exercise-future", prompt: "Elige dos cambios del entorno nombrados en el capítulo y explica cómo complican la tarea administrativa.", check: "Puedes usar crecimiento, competencia, tecnología, globalización o visibilidad; vincula cada cambio con mayor coordinación, adaptación o incertidumbre.", refs: ["future", "coming"] }
    ],
    quiz: [
      { id: "quiz-process", prompt: "¿Qué opción describe mejor la administración en el capítulo?", options: ["Ejecutar tareas sin coordinar a otros", "Coordinar esfuerzos y recursos hacia objetivos", "Aplicar una receta universal"], correctIndex: 1, explanation: "El proceso está orientado a objetivos y coordina personas, recursos y acciones.", refs: ["content", "concept"] },
      { id: "quiz-art", prompt: "¿Qué dimensión destaca la intuición y la respuesta creativa ante situaciones?", options: ["Arte", "Tecnología", "Estructura"], correctIndex: 0, explanation: "La figura 1.1 y el texto asocian el arte con visión, intuición y creatividad.", refs: ["content", "science"] },
      { id: "quiz-variables", prompt: "¿Cuál de estas pertenece a las seis variables básicas de la TGA?", options: ["Competitividad", "Antigüedad de la empresa", "Tamaño de la clase"], correctIndex: 0, explanation: "Competitividad figura junto con tareas, estructura, personas, tecnología y ambiente.", refs: ["variables"] },
      { id: "quiz-interaction", prompt: "Según el capítulo, las seis variables…", options: ["Actúan por separado", "Interactúan y pueden influirse", "Son una escala de dominio"], correctIndex: 1, explanation: "La TGA las presenta como interdependientes; sus cambios pueden repercutir en el conjunto.", refs: ["variables"] },
      { id: "quiz-future", prompt: "¿Qué presión aparece entre las perspectivas futuras?", options: ["Menor necesidad de coordinación", "Ausencia de cambio tecnológico", "Globalización e internacionalización"], correctIndex: 2, explanation: "El capítulo incluye la globalización y la internacionalización entre los factores que afectan a las organizaciones.", refs: ["future", "coming"] }
    ],
    glossary: [
      { id: "term-administracion", term: "Administración", definition: "Proceso de conducir una organización o parte de ella y usar recursos para alcanzar objetivos con eficiencia y eficacia.", refs: ["glossary"] },
      { id: "term-organizacion", term: "Organización", definition: "Entidad social de personas y recursos estructurada deliberadamente para un objetivo común.", refs: ["glossary"] },
      { id: "term-tga", term: "Teoría general de la administración", definition: "Conjunto integral de teorías, hipótesis, conceptos e ideas sobre la administración.", refs: ["glossary"] },
      { id: "term-eficacia", term: "Eficacia", definition: "Alcanzar objetivos y resultados.", refs: ["glossary"] },
      { id: "term-eficiencia", term: "Eficiencia", definition: "Hacer las cosas correctamente y ejecutar bien el trabajo.", refs: ["glossary"] },
      { id: "term-competitividad", term: "Competitividad", definition: "Capacidad de ofrecer productos y servicios mejores, más baratos y adecuados al mercado, con soluciones innovadoras para el cliente.", refs: ["glossary"] },
      { id: "term-enfasis-tareas", term: "Énfasis en las tareas", definition: "Enfoque que atiende la racionalización y planificación de actividades operacionales.", refs: ["glossary"] },
      { id: "term-enfasis-personas", term: "Énfasis en las personas", definition: "Enfoque que centra la administración en las personas y sus actividades en las organizaciones.", refs: ["glossary"] }
    ],
    capabilities: ["overview", "objectives", "summary", "sections", "concept-map", "examples", "flashcards", "exercises", "quiz", "glossary"]
  };

  if (typeof module === "object" && module.exports) module.exports = bundle;
  if (root) root.MI_LESSON_BUNDLE = bundle;
})(typeof window !== "undefined" ? window : null);
