import os
import re

file_path = r"c:\Users\quant\OneDrive\Desktop\INIT IDEA\index.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix encodings using HTML entities for the problematic texts
encodings_to_fix = {
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
    "estudio": "estudio",
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
    "M&eacute;todos": "M&eacute;todos",
    "tambi&eacute;n": "tambi&eacute;n",
    "Salomón Ramírez Ortega": "INIT IDEA",
    "Salom&oacute;n Ram&iacute;rez Ortega": "INIT IDEA",
    "Salomn Ramrez Ortega": "INIT IDEA"
}

for k, v in encodings_to_fix.items():
    content = content.replace(k, v)


# 2. Fix the Payment methods section.
# We will replace the entire `.order-modal-payment` div to the end of modal box with the correct single payment method.
import re

new_payment_section = """      <div class="order-modal-payment">
        <h3 class="order-modal-payment-title lang-es"><i class="fas fa-money-check-alt"></i> Datos de Pago</h3>
        <h3 class="order-modal-payment-title lang-en"><i class="fas fa-money-check-alt"></i> Payment Details</h3>

        <div class="pay-method">
          <div class="pay-method-header">
            <i class="fas fa-university"></i>
            <strong class="lang-es">Transferencia Bancaria</strong>
            <strong class="lang-en">Bank Transfer</strong>
          </div>
          <div class="pay-details">
            <div class="pay-detail-row"><span class="lang-es">Instituci&oacute;n:</span><span class="lang-en">Institution:</span><strong>Mercado Pago / STP</strong></div>
            <div class="pay-detail-row"><span class="lang-es">Titular:</span><span class="lang-en">Account Holder:</span><strong>INIT IDEA</strong></div>
            <div class="pay-detail-row"><span class="lang-es">CLABE interbancaria:</span><span class="lang-en">CLABE:</span><strong>722969020698416641</strong></div>
          </div>
        </div>

        <p class="order-modal-disclaimer lang-es">&#x23F1; Tiempo de entrega estimado: <strong>1 semana a 15 d&iacute;as h&aacute;biles</strong> dependiendo de la complejidad de tu tarjeta o invitaci&oacute;n digital.</p>
        <p class="order-modal-disclaimer lang-en">&#x23F1; Estimated delivery: <strong>1 to 15 business days</strong> depending on your card or digital invitation complexity.</p>
      </div>
    </div>
  </div>"""

# Find where the `<div class="order-modal-payment">` starts and replace up to `</div>\n    </div>\n  </div>`
pattern = r'(<div class="order-modal-payment">)(.*?)(\s+</div>\s+</div>\s+</div>)'
content = re.sub(pattern, new_payment_section, content, flags=re.DOTALL)


# 3. Clean up the messed up end of file (everything after the first </body>\n</html>)
# Since the regex might have been greedy or we can just truncate.
end_tag = "</body>\n</html>"
if end_tag in content:
    # Take everything up to the first </body></html> and include it, dropping the rest.
    content = content.split(end_tag)[0] + end_tag

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html fixed!")
