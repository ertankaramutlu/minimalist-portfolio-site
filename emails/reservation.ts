/**
 * Rezervasyon e-posta HTML şablonları
 * Tüm stiller inline — büyük e-posta istemcileriyle uyumlu.
 */

/* ─── Ortak yardımcılar ──────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const base = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #fafafa;
  margin: 0; padding: 0;
`

function wrapper(content: string) {
  return /* html */ `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="${base}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="
          max-width:600px;width:100%;
          background:#ffffff;
          border:1px solid #e5e5e5;
          border-radius:12px;
          overflow:hidden;
        ">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/* ─── Onay e-postası ─────────────────────────────────────────────────────── */

export type ReservationEmailParams = {
  name: string
  date: string   // YYYY-MM-DD
  time: string
  guests: number
  notes?: string
}

export function approvedEmail(p: ReservationEmailParams): string {
  return wrapper(/* html */`
    <!-- Başlık -->
    <tr>
      <td style="background:#171717;padding:32px 40px;">
        <p style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.4px;">
          Elif Demir<span style="color:#a3a3a3;">.</span>
        </p>
      </td>
    </tr>

    <!-- İçerik -->
    <tr>
      <td style="padding:40px 40px 32px;">
        <p style="margin:0 0 8px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:3px;color:#737373;">
          Rezervasyon Onayı
        </p>
        <h1 style="margin:0 0 24px;font-size:26px;font-weight:600;color:#171717;letter-spacing:-0.5px;line-height:1.3;">
          Rezervasyonunuz onaylandı ✅
        </h1>
        <p style="margin:0 0 32px;font-size:15px;color:#525252;line-height:1.7;">
          Merhaba <strong>${p.name}</strong>, rezervasyon talebiniz değerlendirildi ve onaylandı.
          Sizi ağırlamaktan mutluluk duyacağız.
        </p>

        <!-- Detay kutusu -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          background:#f5f5f5;border-radius:8px;
          border:1px solid #e5e5e5;margin-bottom:32px;
        ">
          <tr>
            <td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${detailRow('📅 Tarih', formatDate(p.date))}
                ${detailRow('🕐 Saat', p.time)}
                ${detailRow('👥 Kişi Sayısı', `${p.guests} kişi`)}
                ${p.notes ? detailRow('📝 Notunuz', p.notes) : ''}
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:14px;color:#525252;line-height:1.7;">
          Herhangi bir değişiklik veya iptal için lütfen en az <strong>24 saat öncesinden</strong>
          bizimle iletişime geçin.
        </p>
        <p style="margin:0;font-size:14px;color:#525252;">
          📞 +90 212 000 00 00 &nbsp;|&nbsp; 📧 rezervasyon@elifdemir.com
        </p>
      </td>
    </tr>

    ${footer()}
  `)
}

/* ─── Red e-postası ──────────────────────────────────────────────────────── */

export function rejectedEmail(p: ReservationEmailParams): string {
  return wrapper(/* html */`
    <!-- Başlık -->
    <tr>
      <td style="background:#171717;padding:32px 40px;">
        <p style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:-0.4px;">
          Elif Demir<span style="color:#a3a3a3;">.</span>
        </p>
      </td>
    </tr>

    <!-- İçerik -->
    <tr>
      <td style="padding:40px 40px 32px;">
        <p style="margin:0 0 8px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:3px;color:#737373;">
          Rezervasyon Bildirimi
        </p>
        <h1 style="margin:0 0 24px;font-size:26px;font-weight:600;color:#171717;letter-spacing:-0.5px;line-height:1.3;">
          Rezervasyon talebiniz reddedildi
        </h1>
        <p style="margin:0 0 32px;font-size:15px;color:#525252;line-height:1.7;">
          Merhaba <strong>${p.name}</strong>, maalesef aşağıdaki rezervasyon talebinizi
          şu an için karşılayamıyoruz. Farklı bir tarih veya saat için tekrar deneyebilirsiniz.
        </p>

        <!-- Detay kutusu -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          background:#fef2f2;border-radius:8px;
          border:1px solid #fecaca;margin-bottom:32px;
        ">
          <tr>
            <td style="padding:24px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${detailRow('📅 Tarih', formatDate(p.date))}
                ${detailRow('🕐 Saat', p.time)}
                ${detailRow('👥 Kişi Sayısı', `${p.guests} kişi`)}
              </table>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:14px;color:#525252;line-height:1.7;">
          Uygun başka bir slot için formumuzu kullanabilir ya da doğrudan bize ulaşabilirsiniz.
        </p>
        <p style="margin:0;font-size:14px;color:#525252;">
          📞 +90 212 000 00 00 &nbsp;|&nbsp; 📧 rezervasyon@elifdemir.com
        </p>
      </td>
    </tr>

    ${footer()}
  `)
}

/* ─── Yardımcı parçalar ──────────────────────────────────────────────────── */

function detailRow(label: string, value: string) {
  return /* html */`
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#737373;white-space:nowrap;width:1%;padding-right:24px;">
        ${label}
      </td>
      <td style="padding:6px 0;font-size:13px;color:#171717;font-weight:500;">
        ${value}
      </td>
    </tr>`
}

function footer() {
  return /* html */`
    <tr>
      <td style="border-top:1px solid #e5e5e5;padding:24px 40px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#a3a3a3;font-family:monospace;text-transform:uppercase;letter-spacing:2px;">
          © ${new Date().getFullYear()} Elif Demir &nbsp;·&nbsp; İstanbul, Türkiye
        </p>
      </td>
    </tr>`
}
