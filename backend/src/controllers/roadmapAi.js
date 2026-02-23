const { GoogleGenAI } = require("@google/genai");

const roadmapSystemInstruction = `You are a career and mastery roadmap generator.
Return ONLY a strictly valid JSON object with this exact schema:
{
  "title": "",
  "roleOrSubject": "",
  "summary": "",
  "roadmap": [
    {
      "phase": "",
      "duration": "",
      "focus": [],
      "topics": [],
      "projects": [],
      "milestones": []
    }
  ],
  "interviewQuestions": []
}

Rules:
- "roadmap" must be an ordered list of phases (at least 5).
- Each "phase" must include a short title in "phase" and a realistic "duration".
- "focus", "topics", "projects", "milestones" must be arrays of strings.
- If interview questions are requested, include exactly 20 concise questions in "interviewQuestions".
- If interview questions are NOT requested, return an empty array.
- Do NOT include markdown or code fences.`;

const buildRoadmap = async (req, res) => {
  try {
    const { roleOrSubject, includeInterviewQuestions } = req.body;

    if (!roleOrSubject || typeof roleOrSubject !== "string") {
      return res.status(400).json({ message: "roleOrSubject is required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

    const prompt = `
Role/Subject: ${roleOrSubject}
Include Interview Questions: ${includeInterviewQuestions ? "Yes (exactly 20)" : "No"}

Generate a practical roadmap that is clear, modern, and outcome-focused.
`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: roadmapSystemInstruction
      }
    });

    const responseText = result.text || "";
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { buildRoadmap };
