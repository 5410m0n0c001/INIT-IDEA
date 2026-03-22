$path = "c:\Users\quant\OneDrive\Desktop\INIT IDEA\index.html"
$content = Get-Content $path -Raw -Encoding UTF8

$replacements = @{
    "&ntilde;" = "ñ"
    "&oacute;" = "ó"
    "&Uacute;" = "Ú"
    "&aacute;" = "á"
    "&eacute;" = "é"
    "&iacute;" = "í"
    "&iquest;" = "¿"
    "&amp;" = "&"
    "&#x23F1;" = "⏱"
    "&#x20E3;" = "⃣"
    "&#x1F4CC;" = "📌"
    "&#x1F4DD;" = "📝"
    "&#x1F4B0;" = "💰"
    "&#x1F4B3;" = "💳"
    "&mdash;" = "—"
    "DiseÃ±o" = "Diseño"
    "IntegraciÃ³n" = "Integración"
    "Ãšltimos" = "Últimos"
    "mÃ¡s" = "más"
    "innovaciÃ³n" = "innovación"
    "diseÃ±o" = "diseño"
    "tecnolÃ³gico" = "tecnológico"
    "prÃ¡cticos" = "prácticos"
    "conexiÃ³n" = "conexión"
    "CreaciÃ³n" = "Creación"
    "estÃ©ticos" = "estéticos"
    "ProgramaciÃ³n" = "Programación"
    "gestiÃ³n" = "gestión"
    "AsesorÃa" = "Asesoría"
    "tecnolÃ³gica" = "tecnológica"
    "dinÃ¡micos" = "dinámicos"
    "cafeterÃas" = "cafeterías"
    "TelÃ©fono" = "Teléfono"
    "SÃguenos" = "Síguenos"
    "Â¿Tienes" = "¿Tienes"
    "PresentaciÃ³n" = "Presentación"
    "ExhibiciÃ³n" = "Exhibición"
    "PlanificaciÃ³n" = "Planificación"
    "HernÃ¡ndez" = "Hernández"
    "Â¿CÃ³mo" = "¿Cómo"
    "depÃ³sito" = "depósito"
    "nÃºmero" = "número"
    "llegarÃ¡" = "llegará"
    "dÃas" = "días"
    "hÃ¡biles" = "hábiles"
    "segÃºn" = "según"
}

foreach ($key in $replacements.Keys) {
    # Escape regex specials just in case, though these are mostly safe
    $escaped_key = [regex]::Escape($key)
    $content = $content -replace $escaped_key, $replacements[$key]
}

# Add BOM using UTF8Encoding($true)
$utf8NoBom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
