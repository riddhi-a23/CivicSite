import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON and urlencoded requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize GoogleGenAI on the server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route: Analyze
  app.post("/api/analyze", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]), async (req: any, res) => {
    try {
      const text = req.body.text || "Analyze this community hazard.";
      const parts: any[] = [{ text: text }];

      // Handling uploaded files using memory storage buffers
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      
      if (files?.image?.[0]) {
        const imageFile = files.image[0];
        parts.push({
          inlineData: {
            data: imageFile.buffer.toString('base64'),
            mimeType: imageFile.mimetype
          }
        });
      }

      if (files?.video?.[0]) {
        const videoFile = files.video[0];
        parts.push({
          inlineData: {
            data: videoFile.buffer.toString('base64'),
            mimeType: videoFile.mimetype
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: parts },
        config: {
          systemInstruction: `You are the central intelligence engine of CivicSite. 
          FIRST, verify if the provided text/media is a legitimate community infrastructure issue (e.g., pothole, leak, waste, damage, unsafe conditions). If it is spam, a random object, or not a civic hazard, set "is_civic_hazard" to false and provide a "rejection_reason".`,
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              is_civic_hazard: { 
                type: Type.BOOLEAN,
                description: "Whether the report is a legitimate community infrastructure hazard."
              },
              rejection_reason: { 
                type: Type.STRING,
                description: "If not a civic hazard, explain why it was rejected. Otherwise, leave empty."
              },
              category: { 
                type: Type.STRING,
                description: "Category of the hazard, e.g., Pothole, Water Leakage, Garbage Pile, Broken Streetlight, etc."
              },
              severity: { 
                type: Type.STRING,
                description: "Severity level: Low, Medium, High, or Critical."
              },
              risk_score: { 
                type: Type.INTEGER,
                description: "Risk score from 0 to 100."
              },
              recommended_action: { 
                type: Type.STRING,
                description: "Immediate action recommended to secure or address the hazard."
              },
              xp_rewarded: { 
                type: Type.INTEGER,
                description: "XP points to reward the user for submitting this report (from 10 to 50)."
              },
              badge_earned: { 
                type: Type.STRING,
                description: "A fun civic badge name earned for this contribution."
              },
              estimated_cost: { 
                type: Type.STRING,
                description: "Estimated cost of repair (e.g., '₹5,000 - ₹10,000' or equivalent regional cost)."
              },
              department_needed: { 
                type: Type.STRING,
                description: "The municipal department responsible for addressing this issue, e.g., Public Works Department, Water & Sanitation, Sanitation, Electrical Dept."
              }
            },
            required: [
              "is_civic_hazard", 
              "rejection_reason", 
              "category", 
              "severity", 
              "risk_score", 
              "recommended_action", 
              "xp_rewarded", 
              "badge_earned", 
              "estimated_cost", 
              "department_needed"
            ]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText));
    } catch (error) {
      console.error("Gemini API Error in /api/analyze:", error);
      res.status(500).json({ error: "Failed to analyze report" });
    }
  });

  // API Route: Predict
  app.post("/api/predict", async (req, res) => {
    try {
      const { feed } = req.body;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Analyze these recent community issues: ${JSON.stringify(feed)}`,
        config: {
          systemInstruction: `You are CivicSite's predictive analytics engine. Analyze the provided JSON array of recent infrastructure hazards. Generate a single, highly professional 1-2 sentence predictive insight about potential future compounding risks (e.g., "Multiple water leaks in Sector 4 predict an 80% chance of sinkholes within 72 hours."). If the list is empty, state that more data is required.`,
          temperature: 0.4, 
        }
      });

      res.json({ insight: response.text });
    } catch (error) {
      console.error("Prediction API Error in /api/predict:", error);
      res.status(500).json({ error: "Failed to analyze trends" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
