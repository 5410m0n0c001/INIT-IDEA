const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    const encodings_to_fix = {
        "Diseño": "Dise&ntilde;o",
        "Integración": "Integraci&oacute;n",
        "Últimos": "&Uacute;ltimos",
        "más": "m&aacute;s",
        "innovación": "innovaci&oacute;n",
        "diseño": "dise&ntilde;o",
        "tecnológico": "tecnol&oacute;gico",
        "prácticos": "pr&aacute;cticos",
        "conexión": "conexi&oacute;n",
        "Creación": "Creaci&oacute;n",
        "estéticos": "est&eacute;ticos",
        "Programación": "Programaci&oacute;n",
        "gestión": "gesti&oacute;n",
        "Asesoría": "Asesor&iacute;a",
        "tecnológica": "tecnol&oacute;gica",
        "dinámicos": "din&aacute;micos",
        "cafeterías": "cafeter&iacute;as",
        "Teléfono": "Tel&eacute;fono",
        "Síguenos": "S&iacute;guenos",
        "¿Tienes dudas?": "&iquest;Tienes dudas?",
        "Presentación": "Presentaci&oacute;n",
        "Exhibición": "Exhibici&oacute;n",
        "Planificación": "Planificaci&oacute;n",
        "Hernández": "Hern&aacute;ndez",
        "¿Cómo funciona?": "&iquest;C&oacute;mo funciona?",
        "depósito": "dep&oacute;sito",
        "número": "n&uacute;mero",
        "llegará": "llegar&aacute;",
        "días": "d&iacute;as",
        "hábiles": "h&aacute;biles",
        "según": "seg&uacute;n",
        "Salomón Ramírez Ortega": "INIT IDEA",
        "Salom&oacute;n Ram&iacute;rez Ortega": "INIT IDEA",
        "Salomn Ramrez Ortega": "INIT IDEA"
    };

    for (const [k, v] of Object.entries(encodings_to_fix)) {
        content = content.split(k).join(v);
    }
    
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Fixed encodings via Node.js script');
} catch (err) {
    console.error('Error modifying index.html', err);
}
