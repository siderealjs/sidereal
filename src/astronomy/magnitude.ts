export function calculateAlphaWikipedia(dbo, dbs, dos) {
  // Calcola il coseno dell'angolo alpha
  let cosAlpha = (dbo * dbo + dbs * dbs - dos * dos) / (2 * dbo * dbs);

  // Assicurati che il valore di cosAlpha sia compreso tra -1 e 1 per evitare errori
  // if (cosAlpha < -1) cosAlpha = -1;
  // if (cosAlpha > 1) cosAlpha = 1;

  // Calcola l'angolo in radianti usando l'inverso del coseno
  const alphaRadians = Math.acos(cosAlpha);

  // Converte l'angolo in gradi (opzionale)
  const alphaDegrees = alphaRadians * (180 / Math.PI);

  return {
    radians: alphaRadians,
    degrees: alphaDegrees,
  };
}

export function calculateQ(a) {
  // Converti l'angolo da gradi a radianti
  const aRadians = a * (Math.PI / 180);

  // Calcola il valore di q
  const q =
    (2 / 3) *
    ((1 - a / 180) * Math.cos(aRadians) + (1 / Math.PI) * Math.sin(aRadians));

  return q;
}

export function calculateQemp(alpha) {
  // Converti l'angolo da gradi a radianti
  if (alpha > 0 && alpha <= 50) {
    return 0.02267 * alpha - 0.0001302 * alpha * alpha;
  } else {
    // Calcola il valore usando l'espressione fornita
    return 1.234 - 0.02573 * alpha + 0.0003445 * Math.pow(alpha, 2);
  }
}


