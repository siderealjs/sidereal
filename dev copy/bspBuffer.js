import fs from "fs";
import path from "path";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, "de430.bsp");
const buffer = fs.readFileSync(filePath);
console.log(13, buffer.length);

const headerLength = 1024 * 8;
const headerBuffer = buffer.slice(0, headerLength);

// Log dell'header per la verifica
console.log("Header:", headerBuffer.toString("utf-8"));

// Supponiamo di voler leggere un campione di dati
const dataStart = headerLength;
const dataBuffer = buffer.slice(dataStart, dataStart + 256); // Leggi un campione di dati

// Esempio di lettura di dati e interpretazione come testo leggibile
const dataRecordLength = 64; // Supponiamo che ogni record sia di 64 byte

const finaltext = [];
for (let i = 0; i < dataBuffer.length; i += dataRecordLength) {
  const recordBuffer = dataBuffer.slice(i, i + dataRecordLength);

  // Converti il buffer in una stringa leggibile
  const recordText = recordBuffer.toString("utf-8").trim(); // 'utf-8' può essere cambiato a seconda del encoding dei dati

  finaltext.push(recordText);
}

console.log(finaltext.join(" "));



// import fs from 'fs';
// import path from 'path';
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const filePath = path.join(__dirname, 'de430.bsp');
// const buffer = fs.readFileSync(filePath);
// console.log('File length:', buffer.length);

// const headerLength = 1024 * 8; // Lunghezza dell'header
// const headerBuffer = buffer.slice(0, headerLength);

// // Log dell'header per la verifica
// console.log('Header:', headerBuffer.toString('utf-8', 0, 512)); // Leggi solo una parte per evitare l'overflow

// // Supponiamo di voler leggere un campione di dati
// const dataStart = headerLength;
// const dataBuffer = buffer.slice(dataStart, dataStart + 256); // Leggi un campione di dati

// const dataRecordLength = 64; // Supponiamo che ogni record sia di 64 byte

// const finalText = [];
// for (let i = 0; i < dataBuffer.length; i += dataRecordLength) {
//   const recordBuffer = dataBuffer.slice(i, i + dataRecordLength);

//   // Converti il buffer in una stringa leggibile
//   // Aggiungi un controllo per i dati non testuali
//   try {
//     const recordText = recordBuffer.toString('utf-8').trim();
//     if (recordText.match(/[ -~]+/)) { // Verifica se il testo è leggibile
//       finalText.push(recordText);
//       console.log('737373')
//     } else {
//         console.log('bdata')
//       finalText.push('<binary data>');
//     }
//   } catch (err) {
//     console.log('error')
//     finalText.push('<error>');
//   }
// }

// console.log(finalText.join(' '));
