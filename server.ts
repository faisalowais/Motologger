import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI SDK with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * POST /api/gemini/parse-bill
 * Reads workshop bill, receipt, or invoice photo/document
 * and extracts service parameters, numbers, costs, and notes.
 */
app.post('/api/gemini/parse-bill', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', billText } = req.body;

    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, ''),
        },
      });
    }

    const promptText = `
You are an expert motorcycle mechanic and service ledger auditor.
Analyze this motorcycle maintenance invoice, receipt, or service bill document.
Extract all mechanical numbers, odometer readings, component targets, parts costs, and labour fees accurately.

${billText ? `Additional context / bill text: "${billText}"` : ''}

Output a strictly valid JSON object matching this schema:
{
  "odometer": number (e.g. 12213),
  "serviceDate": string (e.g. "12 Oct 2026"),
  "targetComponent": string (e.g. "Engine Oil & Sump", "Rear Brake Pads", "Drive Chain", "Air Filter", "Spark Plug"),
  "action": string (one of: "Replaced", "Inspected", "Cleaned", "Lubricated", "Topped Up"),
  "oilBrand": string (e.g. "Motul", "Castrol", "Shell", or OEM),
  "viscosity": string (e.g. "10W-40 (7100 4T)", "10W-50", "15W-50"),
  "fluidQty": number (e.g. 1.2, in litres),
  "filterChanged": boolean (true if oil filter or cartridge was replaced),
  "strainerCleaned": boolean (true if oil mesh strainer was cleaned),
  "partsCost": number (currency amount in numbers for parts/consumables),
  "labourCost": number (currency amount in numbers for labour/bay fee),
  "isDiy": boolean (false if workshop bill, true if self-purchased DIY),
  "notes": string (brief technical description of work performed and parts used),
  "invoiceNumber": string,
  "workshopName": string
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error parsing bill:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze maintenance bill with Gemini.',
    });
  }
});

/**
 * POST /api/gemini/parse-vehicle-docs
 * Analyzes uploaded service records history and owner's manual
 * to automatically build the new motorcycle profile, historical service records,
 * and calibrated component wear status!
 */
app.post('/api/gemini/parse-vehicle-docs', async (req, res) => {
  try {
    const { documents = [], manualText = '', recordsText = '', vehicleHint = '' } = req.body;

    const parts: any[] = [];

    // Add attached documents (images / PDFs)
    for (const doc of documents) {
      if (doc.data) {
        parts.push({
          inlineData: {
            mimeType: doc.mimeType || 'image/jpeg',
            data: doc.data.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, ''),
          },
        });
      }
    }

    const promptText = `
You are an expert motorcycle fleet engineer and telematics specialist.
The user is adding a motorcycle to their garage and has provided previous service records, receipts, and/or user manual excerpts.
${vehicleHint ? `User note / bike hint: "${vehicleHint}"` : ''}
${manualText ? `Manual notes: "${manualText}"` : ''}
${recordsText ? `Previous records transcript: "${recordsText}"` : ''}

Your task:
1. Identify the Motorcycle details: Full name, short badge name, year, engine displacement (e.g. 390 cc, 650 cc), category (e.g. Adventure, Cafe Racer, Naked Sport), VIN (last 4 digits e.g. "····8921").
2. Reconstruct the complete chronological Service History from the bills/records. Each log must have:
   - date (e.g. "15 Jun 2025")
   - odometer (number)
   - title
   - action ("Replaced" | "Inspected" | "Cleaned" | "Lubricated" | "Topped Up")
   - targetComponent (e.g. "Engine Oil", "Drive Chain", "Front Brake Pads", "Air Filter")
   - description (parts used, torque notes)
   - partsCost (number)
   - labourCost (number)
   - isDiy (boolean)
3. Determine current total odometer reading from the latest record.
4. From the user manual service intervals and the last service records, generate the list of tracked components with wear percentage (0-100), used km, remaining km, interval km, and status ("healthy" | "due_soon" | "action_req").
   Include components like: Engine Oil, Air Filter, Spark Plug, Drive Chain, Front Brake Pads, Rear Brake Pads, Brake Fluid, Coolant (if liquid cooled).

Output a strictly valid JSON object matching this schema:
{
  "name": string,
  "shortName": string,
  "year": number,
  "displacement": string,
  "category": string,
  "vin": string,
  "odometer": number,
  "lastServiceDate": string,
  "lastServiceOdo": number,
  "totalSpend": number,
  "serviceHistory": [
    {
      "id": string,
      "date": string,
      "odometer": number,
      "title": string,
      "action": string,
      "targetComponent": string,
      "description": string,
      "partsCost": number,
      "labourCost": number,
      "isDiy": boolean,
      "oilBrand": string,
      "oilViscosity": string,
      "fluidQty": number
    }
  ],
  "components": [
    {
      "id": string,
      "name": string,
      "category": string,
      "spec": string,
      "intervalKm": number,
      "usedKm": number,
      "remainingKm": number,
      "percentage": number,
      "status": string,
      "statusLabel": string,
      "icon": string,
      "specDetail": string,
      "capacity": string,
      "critical": boolean
    }
  ]
}
`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing vehicle docs:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze motorcycle documents with Gemini.',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MotoLedger server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
