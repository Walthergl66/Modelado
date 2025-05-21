const form = document.getElementById("converter-form") as HTMLFormElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const fromSelect = document.getElementById("from-currency") as HTMLSelectElement;
const toSelect = document.getElementById("to-currency") as HTMLSelectElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

// API Key gratuita desde https://www.exchangerate-api.com/
const API_KEY = "ebb851cfd1c9aa66e71c3934";
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

async function loadCurrencies() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.conversion_rates) throw new Error("Datos inválidos");

    const currencies = Object.keys(data.conversion_rates);
    currencies.forEach(currency => {
      const option1 = new Option(currency, currency);
      const option2 = new Option(currency, currency);
      fromSelect.add(option1);
      toSelect.add(option2);
    });

    fromSelect.value = "USD";
    toSelect.value = "EUR";
  } catch (error) {
    resultDiv.textContent = "Error al cargar monedas.";
    console.error(error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount)) {
    resultDiv.textContent = "Ingresa una cantidad válida.";
    return;
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
    const data = await res.json();
    const rate = data.conversion_rates[to];

    if (!rate) throw new Error("Moneda no válida");

    const converted = amount * rate;
    resultDiv.textContent = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  } catch (error) {
    resultDiv.textContent = "Error en la conversión.";
    console.error(error);
  }
});

loadCurrencies();
