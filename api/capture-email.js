import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ ok: false, error: 'Valid email required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase
      .from('quiz_leads')
      .upsert([{ email: cleanEmail }], { onConflict: 'email' });

    if (error) {
      console.error('Supabase insert failed:', error);
      return res.status(500).json({ ok: false, error: 'Database insert failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('capture-email error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}