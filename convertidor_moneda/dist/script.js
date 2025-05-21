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
const form = document.getElementById("converter-form");
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from-currency");
const toSelect = document.getElementById("to-currency");
const resultDiv = document.getElementById("result");
// API Key gratuita desde https://www.exchangerate-api.com/
const API_KEY = "ebb851cfd1c9aa66e71c3934";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
function loadCurrencies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(API_URL);
            const data = yield res.json();
            if (!data.conversion_rates)
                throw new Error("Datos inválidos");
            const currencies = Object.keys(data.conversion_rates);
            currencies.forEach(currency => {
                const option1 = new Option(currency, currency);
                const option2 = new Option(currency, currency);
                fromSelect.add(option1);
                toSelect.add(option2);
            });
            fromSelect.value = "USD";
            toSelect.value = "EUR";
        }
        catch (error) {
            resultDiv.textContent = "Error al cargar monedas.";
            console.error(error);
        }
    });
}
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;
    if (isNaN(amount)) {
        resultDiv.textContent = "Ingresa una cantidad válida.";
        return;
    }
    try {
        const res = yield fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
        const data = yield res.json();
        const rate = data.conversion_rates[to];
        if (!rate)
            throw new Error("Moneda no válida");
        const converted = amount * rate;
        resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
    }
    catch (error) {
        resultDiv.textContent = "Error en la conversión.";
        console.error(error);
    }
}));
loadCurrencies();
