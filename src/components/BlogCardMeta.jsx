import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const socialIcons = {
  facebook: { Icon: FaFacebookF, label: "Facebook" },
  instagram: { Icon: FaInstagram, label: "Instagram" },
  linkedin: { Icon: FaLinkedinIn, label: "LinkedIn" },
};

export default function BlogCardMeta({
  author,
  socialLinks = [],
  className = "",
}) {
  const socials = socialLinks
    .map((item) => {
      const key = item.name.toLowerCase();
      const social = socialIcons[key];
      return social && item.link ? { ...social, href: item.link } : null;
    })
    .filter(Boolean);

  return (
    <div className={`blog-card-meta ${className}`.trim()}>
      {author && (
        <p className="blog-card-author">
          <span>Posted by</span> <strong>{author}</strong>
        </p>
      )}
      {socials.length > 0 && (
        <nav className="blog-card-socials" aria-label="Social profiles">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              className={`social-${label.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`Follow us on ${label}`}
              title={label}
            >
              <Icon aria-hidden="true" />
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
