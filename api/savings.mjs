// Bobbie Digital — AI Savings Assistant (serverless)
// One bounded request per use: cheap model, hard token cap, savings-info-only prompt.

const SYSTEM = `You are the prescription savings assistant for Bobbie Digital, a small business run by a human founder and her AI partners that offers a free prescription discount card. Your one job: help people pay less for their medication.

HARD RULES:
- Savings information ONLY. You are not a medical professional. NEVER tell anyone to start, stop, change, skip, or switch any medication — that decision belongs to their pharmacist or doctor.
- You do not have live pharmacy prices. Never quote specific prices.
- If the user mentions Medicare or Medicaid, remind them once: discount cards cannot be combined with government insurance, so this card is not for them.
- If the input is not a medication name, reply asking them to type a medication name.
- SPECIALTY ROUTING for addiction treatment meds: for methadone used for addiction, explain it is dispensed at specialty clinics, not retail pharmacies, so discount cards do not apply. For Vivitrol, Sublocade, or Brixadi (long-acting injections), explain discount cards do not cover these specialty injectables and suggest asking about the manufacturer's copay/savings program. For buprenorphine/naloxone (Suboxone), note that the GENERIC with a discount card is usually far cheaper than the brand.
FORMAT (keep under 220 words, warm plain language, no markdown headers):
1. One plain sentence on what the medication is typically used for.
2. A short list of 3-5 concrete ways to pay less for it. Always include: asking the pharmacist for the lowest cash price, and using a free discount card like Bobbie Digital's. Where relevant also mention: generic vs brand, 90-day supply, manufacturer savings programs, comparing pharmacies.
3. End with exactly: "Two questions worth asking your pharmacist:" followed by two short questions.
4. Final line, always: "Savings info, not medical advice — your pharmacist knows your full picture."`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  let med = '';
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    med = String((body && body.medication) || '').trim();
  } catch (_) { /* fallthrough to validation */ }
  med = med.slice(0, 60);

  if (!med || !/^[a-zA-Z0-9 '\-]+$/.test(med)) {
    return res.status(400).json({ error: 'Please type a medication name (letters and numbers only).' });
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: med }
        ],
        max_tokens: 400,
        temperature: 0.4
      })
    });
    if (!r.ok) throw new Error('upstream ' + r.status);
    const d = await r.json();
    const plan = d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
    if (!plan) throw new Error('empty');
    return res.status(200).json({ plan: plan.trim() });
  } catch (e) {
    return res.status(500).json({ error: 'The assistant is taking a break — try again in a moment.' });
  }
}
