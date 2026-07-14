// Single-admin HTTP Basic Auth in front of the whole app -- no user table, no sessions.
// Genuinely sufficient for one admin; revisit if a second reviewer ever needs their own login.
function basicAuth(req, res, next) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) {
    res.status(500).send('Admin credentials not configured (set ADMIN_USER / ADMIN_PASS).');
    return;
  }
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === pass) { next(); return; }
  }
  res.set('WWW-Authenticate', 'Basic realm="Arabic Lab CMS"');
  res.status(401).send('Authentication required.');
}

module.exports = { basicAuth };
