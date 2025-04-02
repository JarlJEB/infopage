
export default async function handler(req, res) {
  const { question } = req.body;
  const fake = "Skillhouse tilbyr rekruttering og konsulenttjenester innen elektro, automasjon og bygg.";
  res.status(200).json({ answer: fake });
}
