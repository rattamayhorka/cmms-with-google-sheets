function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function getDepartamentosYEquipos() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendario MP');
  const values = sheet.getDataRange().getValues();

  const headers = values[0];
  const idIndex = headers.indexOf("ID");
  const departamentoIndex = headers.indexOf("DEPARTAMENTO");
  const equipoIndex = headers.indexOf("EQUIPO");
  const marcaIndex = headers.indexOf("MARCA");

  const departamentos = [...new Set(values.slice(1).map(row => row[departamentoIndex]))]
    .filter(d => d)
    .sort(); // Ordenar alfabéticamente

  const departamentoToEquipos = {};
  const equipoToMarcas = {};
  const equipoToID = {};
  const equipoData = {}; // Para almacenar la información completa de los equipos

  values.slice(1).forEach(row => {
    const departamento = row[departamentoIndex];
    const equipo = row[equipoIndex];
    const marca = row[marcaIndex];
    const idEquipo = row[idIndex];

    if (departamento) {
      if (!departamentoToEquipos[departamento]) departamentoToEquipos[departamento] = [];
      if (equipo && !departamentoToEquipos[departamento].includes(equipo)) {
        departamentoToEquipos[departamento].push(equipo);
      }
    }

    if (equipo) {
      if (!equipoToMarcas[equipo]) equipoToMarcas[equipo] = [];
      if (marca && !equipoToMarcas[equipo].includes(marca)) {
        equipoToMarcas[equipo].push(marca);
      }
    }

    if (equipo && idEquipo) {
      if (!equipoToID[equipo]) equipoToID[equipo] = [];
      if (!equipoToID[equipo].includes(idEquipo)) {
        equipoToID[equipo].push(idEquipo);
      }
      equipoData[idEquipo] = { departamento, equipo, marca };
    }
  });

  // Ordenar las listas alfabéticamente
  Object.keys(departamentoToEquipos).forEach(dep => departamentoToEquipos[dep].sort());
  Object.keys(equipoToMarcas).forEach(eq => equipoToMarcas[eq].sort());
  Object.keys(equipoToID).forEach(eq => equipoToID[eq].sort());

  return {
    departamentos,
    departamentoToEquipos,
    equipoToMarcas,
    equipoToID,
    equipoData
  };
}
// Función para insertar los datos en la hoja de cálculo
function saveData(idEquipo, equipo, marca, departamento, reporte) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reportes_de_servicio');
    sheet.appendRow(["", idEquipo, departamento, "", equipo, marca, "", "", "", "", reporte, new Date()]);
}
