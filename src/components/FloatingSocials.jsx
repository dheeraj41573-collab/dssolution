import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

// Fixed on the left edge. Hover an icon -> it slides open and shows the name.
// Social links and the WhatsApp number are provided by the CMS settings.

const iconMap = {
  facebook: { Icon: FaFacebookF, bg: "bg-[#1877F2]" },
  instagram: {
    Icon: FaInstagram,
    bg: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]",
  },
  linkedin: { Icon: FaLinkedinIn, bg: "bg-[#0A66C2]" },
  whatsapp: { Icon: FaWhatsapp, bg: "bg-[#25D366]" },
};

export default function FloatingSocials({ config, social }) {
  const phone = (
    config.params.footer_phone_secondary || config.params.footer_phone
  ).replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    "Hi, I am interested in your services",
  );

  const items = [
    ...social.floating
      .filter((item) => item.name.toLowerCase() !== "youtube")
      .map((item) => ({
        key: item.name.toLowerCase(),
        name: item.name,
        href: item.link,
      })),
    {
      key: "whatsapp",
      name: "WhatsApp",
      href: `https://wa.me/${phone}?text=${whatsappMessage}`,
    },
  ];

  return (
    <aside
      aria-label="Social links"
      className="fixed top-1/2 left-0 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex"
    >
      {items.map(({ key, name, href }) => {
        const { Icon, bg } = iconMap[key] ?? iconMap.facebook;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={name}
            title={name}
            className={`${bg} social-brand-link flex h-10 w-10 items-center overflow-hidden rounded-r-xl shadow-lg transition-[width] duration-300 ease-out hover:w-36 focus-visible:w-36 sm:h-11 sm:w-11`}
          >
            <span className="grid size-10 shrink-0 place-items-center sm:size-11">
              <Icon className="size-[18px]" />
            </span>
            <span className="pr-4 text-sm font-semibold whitespace-nowrap">
              {name}
            </span>
          </a>
        );
      })}
    </aside>
  );
}
