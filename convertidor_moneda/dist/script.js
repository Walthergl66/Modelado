"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const formulario = document.getElementById("formulario-conversion");
const campoCantidad = document.getElementById("cantidad");
const selectorOrigen = document.getElementById("moneda-origen");
const selectorDestino = document.getElementById("moneda-destino");
const divResultado = document.getElementById("resultado");
// API Key gratuita desde https://www.exchangerate-api.com/
const API_KEY = "ebb851cfd1c9aa66e71c3934";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
// Función para mostrar errores centralizada
function mostrarError(mensaje) {
    divResultado.textContent = mensaje;
    console.error(mensaje);
}
// Cargar monedas y restaurar última conversión
function cargarMonedas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const respuesta = yield fetch(API_URL);
            const datos = yield respuesta.json();
            if (!datos.conversion_rates)
                throw new Error("Datos inválidos");
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
        }
        catch (error) {
            mostrarError("Error al cargar monedas.");
        }
    });
}
// Convertir al enviar el formulario
formulario.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const cantidad = parseFloat(campoCantidad.value);
    const desde = selectorOrigen.value;
    const hacia = selectorDestino.value;
    if (isNaN(cantidad)) {
        mostrarError("Ingresa una cantidad válida.");
        return;
    }
    try {
        const respuesta = yield fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${desde}`);
        const datos = yield respuesta.json();
        const tasa = datos.conversion_rates[hacia];
        if (!tasa)
            throw new Error("Moneda no válida");
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
    }
    catch (error) {
        mostrarError("Error en la conversión.");
    }
}));
// Iniciar al cargar la página
cargarMonedas();
