import React from 'react'

export const metadata = {
  title: 'Privacy Policy - OpsVantage Studio',
  description: 'Privacy policy for Studio by OpsVantage Digital',
}

export default function PrivacyPage() {
  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: 980,
        margin: '0 auto',
        fontFamily: 'system-ui,Segoe UI,Roboto',
      }}
    >
      <h1>Privacy Policy</h1>
      <p>Effective date: January 16, 2026</p>

      <h2>Introduction</h2>
      <p>
        OpsVantage Digital (we, us, our) operates the Studio application at
        <strong> studio.opsvantagedigital.online</strong> (the Service). This Privacy Policy
        explains how we collect, use, disclose, and protect personal information when you use the
        Service.
      </p>

      <h2>Data Controller</h2>
      <p>
        The data controller for personal data processed via the Service is OpsVantage Digital. For
        privacy queries, contact:{' '}
        <a href="mailto:privacy@opsvantagedigital.online">privacy@opsvantagedigital.online</a>.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account & Identity Data</strong>: name, email address, profile picture provided by
          OAuth providers (Google, GitHub).
        </li>
        <li>
          <strong>Usage Data</strong>: pages visited, features used, timestamps, and performance
          metrics collected automatically.
        </li>
        <li>
          <strong>Content & Uploads</strong>: files and media you upload through the Service
          (videos, thumbnails, captions) which you control.
        </li>
        <li>
          <strong>Credentials & Tokens</strong>: OAuth tokens issued by identity providers are used
          transiently to authenticate and are stored only when required by the Service architecture
          (secure storage). We do not store raw provider passwords.
        </li>
        <li>
          <strong>Device & Technical Data</strong>: IP address, browser type/version, operating
          system, and cookie identifiers.
        </li>
      </ul>

      <h2>How We Collect Data</h2>
      <p>
        We collect data you provide directly (forms, uploads, OAuth consent) and automatically via
        the Service (logs, cookies, analytics).
      </p>

      <h2>Legal Bases for Processing</h2>
      <ul>
        <li>Performance of a contract: to provide the Service and its features.</li>
        <li>Legitimate interests: to improve the Service, prevent abuse, and secure accounts.</li>
        <li>
          Consent: where required, for marketing communications and certain analytics cookies.
        </li>
      </ul>

      <h2>Purpose of Processing</h2>
      <p>We process personal data for these primary purposes:</p>
      <ul>
        <li>Authentication and account management.</li>
        <li>Providing core Service features such as upload, processing, and storage.</li>
        <li>Customer support and communications.</li>
        <li>Security, abuse prevention, and fraud detection.</li>
        <li>Analytics, product improvement, and research.</li>
      </ul>

      <h2>Cookies & Tracking</h2>
      <p>
        We use cookies and similar technologies for session management, analytics, and preferences.
        You can manage cookie settings via your browser; note that disabling cookies may affect
        Service functionality.
      </p>

      <h2>Third-Party Services</h2>
      <p>We use third-party providers to operate the Service. These may include:</p>
      <ul>
        <li>
          <strong>Identity Providers</strong>: Google, GitHub (OAuth) for sign-in. They provide the
          user profile and consent information.
        </li>
        <li>
          <strong>Hosting & Deploy</strong>: Vercel or other CDNs to serve the application.
        </li>
        <li>
          <strong>Database & Auth</strong>: Supabase/Postgres for user and application data storage.
        </li>
        <li>
          <strong>AI & Processing</strong>: OpenAI/other AI providers for optional features; only
          when you enable those features.
        </li>
        <li>
          <strong>Analytics</strong>: optional analytics providers to help improve the Service.
        </li>
      </ul>
      <p>
        We assess and require reasonable safeguards from all subprocessors. Links to
        subprocessors&apos; privacy policies are provided in our documentation where applicable.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain data only as long as necessary for the purposes described or to comply with legal
        obligations. You can request deletion of your account and associated data; some anonymised
        logs or backups may persist for operational reasons.
      </p>

      <h2>Data Subject Rights</h2>
      <p>Where applicable, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction or deletion.</li>
        <li>Restrict or object to processing.</li>
        <li>Request portability of your data in a commonly used format.</li>
      </ul>
      <p>
        To exercise these rights, contact{' '}
        <a href="mailto:privacy@opsvantagedigital.online">privacy@opsvantagedigital.online</a>. We
        may ask to verify your identity before processing requests.
      </p>

      <h2>International Transfers</h2>
      <p>
        Your data may be processed outside your jurisdiction. We use standard contractual clauses or
        other lawful transfer mechanisms where required to ensure adequate protection.
      </p>

      <h2>Security</h2>
      <p>
        We implement reasonable administrative, technical, and physical safeguards. These include
        encryption in transit (TLS), secure storage for secrets, access controls, and regular
        security assessments. However, no system is 100% secure; report incidents to{' '}
        <a href="mailto:security@opsvantagedigital.online">security@opsvantagedigital.online</a>.
      </p>

      <h2>Children</h2>
      <p>
        The Service is not intended for children under 13. If you are a parent and believe your
        child provided us with personal data, contact us to request removal.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy. Significant changes will be posted with an updated
        effective date. Continued use of the Service after changes constitutes acceptance.
      </p>

      <h2>Contact</h2>
      <p>For privacy questions or requests:</p>
      <ul>
        <li>
          Email:{' '}
          <a href="mailto:privacy@opsvantagedigital.online">privacy@opsvantagedigital.online</a>
        </li>
        <li>
          Website:{' '}
          <a href="https://studio.opsvantagedigital.online/privacy">
            https://studio.opsvantagedigital.online/privacy
          </a>
        </li>
      </ul>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        OpsVantage Digital • Studio • studio.opsvantagedigital.online
      </p>
    </main>
  )
}
