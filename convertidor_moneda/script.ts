const formulario = document.getElementById("formulario-conversion") as HTMLFormElement;
const campoCantidad = document.getElementById("cantidad") as HTMLInputElement;
const selectorOrigen = document.getElementById("moneda-origen") as HTMLSelectElement;
const selectorDestino = document.getElementById("moneda-destino") as HTMLSelectElement;
const divResultado = document.getElementById("resultado") as HTMLDivElement;

// API Key gratuita desde https://www.exchangerate-api.com/
const API_KEY = "ebb851cfd1c9aa66e71c3934";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// Función para mostrar errores centralizada
function mostrarError(mensaje: string) {
  divResultado.textContent = mensaje;
  console.error(mensaje);
}

// Cargar monedas y restaurar última conversión
async function cargarMonedas() {
  try {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();

    if (!datos.conversion_rates) throw new Error("Datos inválidos");

    const monedas = Object.keys(datos.conversion_rates);
    monedas.forEach(moneda => {
      const opcion1 = new Option(moneda, moneda);
      const opcion2 = new Option(moneda, moneda);
      selectorOrigen.add(opcion1);
      selectorDestino.add(opcion2);
    });

    // Valores por defecto
    selectorOrigen.value = "USD";
    selectorDestino.value = "EUR";

    // Restaurar última conversión si existe
    const guardado = localStorage.getItem("ultimaConversion");
    if (guardado) {
      const conversion = JSON.parse(guardado);
      campoCantidad.value = conversion.amount;
      selectorOrigen.value = conversion.from;
      selectorDestino.value = conversion.to;
      divResultado.textContent = `${conversion.amount} ${conversion.from} = ${conversion.converted} ${conversion.to}`;
    }

  } catch (error) {
    mostrarError("Error al cargar monedas.");
  }
}

// Convertir al enviar el formulario
formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cantidad = parseFloat(campoCantidad.value);
  const desde = selectorOrigen.value;
  const hacia = selectorDestino.value;

  if (isNaN(cantidad)) {
    mostrarError("Ingresa una cantidad válida.");
    return;
  }

  try {
    const respuesta = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${desde}`);
    const datos = await respuesta.json();
    const tasa = datos.conversion_rates[hacia];

    if (!tasa) throw new Error("Moneda no válida");

    const convertido = cantidad * tasa;
    divResultado.textContent = `${cantidad} ${desde} = ${convertido.toFixed(2)} ${hacia}`;

    // Guardar conversión en localStorage
    const datosConversion = {
      amount: cantidad,
      from: desde,
      to: hacia,
      converted: convertido.toFixed(2)
    };
    localStorage.setItem("ultimaConversion", JSON.stringify(datosConversion));
  } catch (error) {
    mostrarError("Error en la conversión.");
  }
});

// Iniciar al cargar la página
cargarMonedas();


//npx tsc inicializa el .js
