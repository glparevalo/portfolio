export default async function handler(req, res) {
  const city = 'Manila';
  const apiKey = process.env.WEATHERAPI_KEY;

  try {
    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
}
