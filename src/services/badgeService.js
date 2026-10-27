const REQUEST_TIMEOUT = 8000;

const ACCREDIBLE_API = 'https://api.accredible.com/v1/obi';
const CREDLY_API = 'https://api.credly.com/v1/obi/v2';

const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function uuidFromUrl(url) {
  try {
    const match = new URL(url).pathname.match(UUID_PATTERN);
    return match ? match[0].toLowerCase() : null;
  } catch {
    return null;
  }
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      const error = new Error(`Réponse ${response.status} de ${new URL(url).hostname}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function isOpenBadgeAssertion(data) {
  const type = [].concat(data?.type ?? []);
  return Boolean(data?.badge) && (type.includes('Assertion') || Boolean(data?.recipient));
}

/**
 * Complète une assertion Open Badges avec sa BadgeClass et son émetteur.
 * Fonctionne pour tout fournisseur qui expose ces URL en JSON (Accredible,
 * Credly, Badgr…) tant que le navigateur est autorisé à les appeler.
 */
async function fromAssertion(assertion, { provider, badgeUrl }) {
  let badgeClass = null;
  let issuer = null;

  if (typeof assertion.badge === 'string') {
    try {
      badgeClass = await fetchJson(assertion.badge);
      if (typeof badgeClass?.issuer === 'string') {
        issuer = await fetchJson(badgeClass.issuer);
      } else if (badgeClass?.issuer?.name) {
        issuer = badgeClass.issuer;
      }
    } catch {
      // La BadgeClass est un bonus : on garde l'assertion seule si elle échoue.
    }
  }

  const title = badgeClass?.name ?? assertion?.badge?.name ?? 'Badge numérique';
  const imageUrl =
    (typeof assertion.image === 'string' && assertion.image) ||
    (typeof assertion.image?.id === 'string' && assertion.image.id) ||
    (typeof badgeClass?.image === 'string' && badgeClass.image) ||
    (typeof badgeClass?.image?.id === 'string' && badgeClass.image.id) ||
    '';

  return {
    provider,
    url: badgeUrl,
    title: String(title).trim(),
    issuer: issuer?.name ?? badgeClass?.issuer?.name ?? '',
    issuerUrl: issuer?.url ?? badgeClass?.issuer?.url ?? '',
    description: String(badgeClass?.description ?? '').trim(),
    imageUrl,
    issuedOn: normalizeDate(assertion.issuedOn ?? assertion.issued_on),
    expiresOn: normalizeDate(assertion.expires ?? assertion.expiresOn ?? assertion.expires_on),
    criteriaUrl: typeof badgeClass?.criteria === 'string' ? badgeClass.criteria : '',
    tags: Array.isArray(badgeClass?.tags) ? badgeClass.tags.slice(0, 6) : [],
    verificationUrl: badgeUrl,
    resolvedAt: new Date().toISOString(),
  };
}

function accredibleAdapter(badgeUrl) {
  const uuid = uuidFromUrl(badgeUrl);
  if (!uuid) throw new Error("URL de badge non reconnue : identifiant introuvable.");
  return fetchJson(`${ACCREDIBLE_API}/badge_assertions/${uuid}`).then((assertion) =>
    fromAssertion(assertion, { provider: 'Accredible', badgeUrl }),
  );
}

function credlyAdapter(badgeUrl) {
  const uuid = uuidFromUrl(badgeUrl);
  if (!uuid) throw new Error("URL de badge non reconnue : identifiant introuvable.");
  return fetchJson(`${CREDLY_API}/badge_assertions/${uuid}`).then((assertion) =>
    fromAssertion(assertion, { provider: 'Credly', badgeUrl }),
  );
}

function openBadgesJsonAdapter(badgeUrl) {
  return fetchJson(badgeUrl).then(async (data) => {
    if (isOpenBadgeAssertion(data)) {
      return fromAssertion(data, { provider: 'Open Badges', badgeUrl });
    }
    if (typeof data?.issuer === 'string' || data?.name) {
      // BadgeClass : on fabrique une assertion minimale.
      return fromAssertion(
        { badge: badgeUrl, name: data.name, issuedOn: null },
        { provider: 'Open Badges', badgeUrl },
      );
    }
    throw new Error("Ce fichier JSON n'est pas un badge Open Badges.");
  });
}

/**
 * Résout les métadonnées d'un badge numérique à partir de son URL publique.
 * L'URL d'un badge Accredible (SUSE, etc.) suffit : l'UUID y figure.
 */
export async function resolveBadge(rawUrl) {
  const badgeUrl = String(rawUrl ?? '').trim();
  if (!badgeUrl) throw new Error('Renseignez l’URL du badge.');

  let parsed;
  try {
    parsed = new URL(badgeUrl);
  } catch {
    throw new Error('URL de badge invalide.');
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error('URL de badge invalide.');
  }

  // L'identifiant de partage (`#acc.…`) n'est pas nécessaire pour l'API.
  parsed.hash = '';
  const canonicalUrl = parsed.toString().replace(/\/$/, '');
  const host = parsed.hostname.toLowerCase();

  try {
    if (host === 'credly.com' || host.endsWith('.credly.com')) {
      return await credlyAdapter(canonicalUrl);
    }
    if (parsed.pathname.endsWith('.json')) {
      return await openBadgesJsonAdapter(canonicalUrl);
    }
    return await accredibleAdapter(canonicalUrl);
  } catch (error) {
    if (error.name === 'TypeError' || error.name === 'AbortError') {
      throw new Error(
        "Impossible de lire ce badge depuis le navigateur (le fournisseur bloque les appels). Renseignez l'image et l'émetteur manuellement.",
      );
    }
    throw error;
  }
}

/** Résumé lisible des dates, ex. « Oct. 2026 → Oct. 2028 ». */
export function formatBadgePeriod(badge) {
  if (!badge) return '';
  const format = (value) =>
    value
      ? new Date(value).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      : null;

  const issued = format(badge.issuedOn);
  const expires = format(badge.expiresOn);
  if (issued && expires) return `${issued} → ${expires}`;
  return issued ?? (expires ? `Expire ${expires}` : '');
}
