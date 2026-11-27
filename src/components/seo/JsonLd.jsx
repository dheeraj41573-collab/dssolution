export default function JsonLd({ schemas }) {
  if (!schemas?.length) return null;
  const json = JSON.stringify(
    schemas.length === 1 ? schemas[0] : schemas,
  ).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
