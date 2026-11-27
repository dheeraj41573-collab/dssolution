import Script from "next/script";

function InlineCode({ id, code }) {
  if (!code?.trim()) return null;
  if (/<\/script\b/i.test(code))
    throw new Error(`SEO script "${id}" contains a closing script tag.`);
  return <script id={id} dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function SeoScripts({
  settings,
  customScripts,
  isAdminPath,
  position,
}) {
  if (isAdminPath) return null;

  if (position === "head")
    return (
      <InlineCode id="seo-custom-head" code={customScripts.customHeadScripts} />
    );

  if (position === "body-start")
    return (
      <>
        <InlineCode
          id="seo-custom-body-start"
          code={customScripts.customBodyStartScripts}
        />
        {settings.gtmContainerId && (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(settings.gtmContainerId)}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
      </>
    );

  if (position !== "footer") return null;

  const ga4Id = settings.ga4MeasurementId;
  const gtmId = settings.gtmContainerId;
  const pixelId = settings.metaPixelId;
  return (
    <>
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`}
            strategy="afterInteractive"
          />
          <Script
            id="seo-ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');`,
            }}
          />
        </>
      )}
      {gtmId && (
        <Script
          id="seo-gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      )}
      {pixelId && (
        <>
          <Script
            id="seo-meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
            }}
          />
          <noscript>
            <img
              alt=""
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
      <InlineCode
        id="seo-custom-footer"
        code={customScripts.customFooterScripts}
      />
    </>
  );
}
