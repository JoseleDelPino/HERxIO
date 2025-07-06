
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateMarketingIdea = async (topic: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key no configurada. No se puede contactar a la IA.");
    }

    const prompt = `
      Eres un experto en marketing político digital y estratega para Coalición Canaria, un partido político regional en las Islas Canarias.
      Tu tarea es generar una idea de campaña de marketing digital creativa, positiva y accionable para el comité local de "La Victoria de Acentejo".

      Tema de la campaña: "${topic}"

      La idea debe ser:
      1.  **Enfocada localmente:** Relevante para los ciudadanos de La Victoria de Acentejo.
      2.  **Digital-first:** Centrada en canales como Instagram, Facebook, WhatsApp y la web local.
      3.  **Participativa:** Que incentive la interacción y el compromiso de la comunidad.
      4.  **Positiva:** Que construya y no destruya, centrada en propuestas y en el futuro del municipio.

      Presenta la idea con un título claro, una breve descripción, los canales a utilizar y un posible eslogan.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("No se pudo generar una idea. Por favor, inténtelo de nuevo más tarde.");
    }
};
