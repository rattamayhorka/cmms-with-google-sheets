// Genera la página web
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function getEquipoInfo() { 
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendario MP');
    const values = sheet.getDataRange().getValues();

    // Obtener índices de las columnas necesarias
    const headers = values[0];
    const departamentoIndex = headers.indexOf("DEPARTAMENTO");
    const equipoIndex = headers.indexOf("EQUIPO");
    const marcaIndex = headers.indexOf("MARCA");
    const idIndex = headers.indexOf("ID");

    // Mapeo final
    const departamentoToEquipos = {};

    values.slice(1).forEach(row => {
        const departamento = row[departamentoIndex];
        const equipo = row[equipoIndex];
        const marca = row[marcaIndex];
        const id = row[idIndex];

        if (departamento && equipo && marca && id) {
            if (!departamentoToEquipos[departamento]) {
                departamentoToEquipos[departamento] = {};
            }
            if (!departamentoToEquipos[departamento][equipo]) {
                departamentoToEquipos[departamento][equipo] = {};
            }
            if (!departamentoToEquipos[departamento][equipo][marca]) {
                departamentoToEquipos[departamento][equipo][marca] = [];
            }
            if (!departamentoToEquipos[departamento][equipo][marca].includes(id)) {
                departamentoToEquipos[departamento][equipo][marca].push(id);
            }
        }
    });

    return {
        departamentos: Object.keys(departamentoToEquipos).sort(),
        departamentoToEquipos
    };
}

function getDetailsById(id) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Calendario MP');
    const values = sheet.getDataRange().getValues();

    // Obtener índices de las columnas necesarias
    const headers = values[0];
    const idIndex = headers.indexOf("ID");
    const areaIndex = headers.indexOf("ÁREA");
    const modeloIndex = headers.indexOf("MODELO");
    const serieIndex = headers.indexOf("N. SERIE");

    // Buscar la fila que contiene el ID
    for (let i = 1; i < values.length; i++) {
        if (values[i][idIndex] === id) {
            return {
                area: values[i][areaIndex],
                modelo: values[i][modeloIndex],
                serie: values[i][serieIndex]
            };
        }
    }
    return { area: "", modelo: "", serie: "" };
}


function saveData(equipo, departamento, marca, id, reporte, area, modelo, serie) { 
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reportes_de_servicio');
    sheet.appendRow(["", id, departamento, area, equipo, marca, modelo, serie, "", "", reporte, new Date()]); 
}
