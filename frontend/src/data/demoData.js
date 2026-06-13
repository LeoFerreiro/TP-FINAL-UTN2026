export const demoCategories = [
  { _id: "study", name: "Estudio", color: "#1677ff" },
  { _id: "work", name: "Trabajo", color: "#15a05c" },
  { _id: "personal", name: "Personal", color: "#7c3aed" },
  { _id: "home", name: "Hogar", color: "#f97316" },
  { _id: "finance", name: "Finanzas", color: "#0891b2" }
];

export const demoTasks = [
  { _id: "1", title: "Leer capítulo 7 de Bases de Datos", description: "Repasar normalización y claves foráneas.", status: "pending", priority: "medium", dueDate: "2026-06-15", category: demoCategories[0] },
  { _id: "2", title: "Preparar presentación de proyecto", description: "Incluir objetivos, alcance y cronograma.", status: "pending", priority: "medium", dueDate: "2026-06-16", category: demoCategories[1] },
  { _id: "3", title: "Comprar despensa semanal", description: "Leche, huevos, verduras y frutas.", status: "pending", priority: "low", dueDate: "2026-06-17", category: demoCategories[3] },
  { _id: "4", title: "Desarrollar API de autenticación", description: "Implementar login, registro y token JWT.", status: "in_progress", priority: "high", dueDate: "2026-06-14", category: demoCategories[1] },
  { _id: "5", title: "Estudiar Cálculo Integral", description: "Resolver ejercicios 1–20 del práctico.", status: "in_progress", priority: "high", dueDate: "2026-06-15", category: demoCategories[0] },
  { _id: "6", title: "Organizar escritorio y archivos", description: "Limpiar documentos y ordenar carpetas.", status: "in_progress", priority: "low", dueDate: "2026-06-18", category: demoCategories[2] },
  { _id: "7", title: "Enviar informe mensual", description: "Informe de métricas de abril.", status: "completed", priority: "medium", dueDate: "2026-06-12", category: demoCategories[1] },
  { _id: "8", title: "Leer 20 páginas de Hábitos Atómicos", description: "Capítulo sobre sistemas y hábitos.", status: "completed", priority: "low", dueDate: "2026-06-11", category: demoCategories[2] },
  { _id: "9", title: "Pagar tarjeta de crédito", description: "Pago mínimo del mes.", status: "completed", priority: "low", dueDate: "2026-06-10", category: demoCategories[4] }
];
