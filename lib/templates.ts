/**
 * Card design templates. Each template defines the full color palette;
 * a wedding's `design` JSON can override individual colors (custom design).
 */

export interface TemplateColors {
  gold: string;
  goldLight: string;
  goldDark: string;
  cream: string;
  creamDark: string;
  ink: string;
  inkLight: string;
  rose: string;
  roseLight: string;
  white: string;
}

/**
 * Layout style of a template. The card JSX stays the same; each variant
 * restyles the frame, ornaments, photo shape and typography via CSS.
 */
export type TemplateVariant = "classic" | "modern" | "floral" | "luxury";

export interface Template {
  id: string;
  name: string;
  description: string;
  variant: TemplateVariant;
  colors: TemplateColors;
}

export const TEMPLATES: Template[] = [
  {
    id: "classic-gold",
    name: "ຄລາສສິກ ທອງ-ຄຣີມ",
    description: "ສີທອງ ແລະ ຄຣີມ ຄລາສສິກ ສະຫງ່າງາມ",
    variant: "classic",
    colors: {
      gold: "#c9a227",
      goldLight: "#e8d48b",
      goldDark: "#a8841f",
      cream: "#fdf8ef",
      creamDark: "#f5ecdc",
      ink: "#3d3a34",
      inkLight: "#6b655a",
      rose: "#b76e79",
      roseLight: "#e8c4c9",
      white: "#ffffff",
    },
  },
  {
    id: "rose-elegant",
    name: "ກຸຫຼາບ ອ່ອນຫວານ",
    description: "ສີບົວກຸຫຼາບ ອ່ອນຫວານ ເໝາະກັບງານທີ່ໂຣແມນຕິກ",
    variant: "classic",
    colors: {
      gold: "#c98a9b",
      goldLight: "#ecc9d2",
      goldDark: "#a85f72",
      cream: "#fdf6f7",
      creamDark: "#f7e6e9",
      ink: "#4a3a3e",
      inkLight: "#7d6a6f",
      rose: "#b76e79",
      roseLight: "#e8c4c9",
      white: "#ffffff",
    },
  },
  {
    id: "forest-green",
    name: "ຂຽວປ່າ ສະຫງົບ",
    description: "ສີຂຽວປ່າ ສົດຊື່ນ ສະຫງົບ ເໝາະກັບງານກາງແຈ້ງ",
    variant: "classic",
    colors: {
      gold: "#7a9e6b",
      goldLight: "#c6d9bc",
      goldDark: "#4f7042",
      cream: "#f6f8f2",
      creamDark: "#e6ecdf",
      ink: "#33382f",
      inkLight: "#6b7263",
      rose: "#b76e79",
      roseLight: "#e8c4c9",
      white: "#ffffff",
    },
  },
  {
    id: "midnight-blue",
    name: "ຟ້າກາງຄືນ ຫຼູຫຼາ",
    description: "ສີຟ້າເຂັ້ມ ກັບ ສີທອງ ຫຼູຫຼາ ທັນສະໄໝ",
    variant: "classic",
    colors: {
      gold: "#c9a227",
      goldLight: "#e8d48b",
      goldDark: "#a8841f",
      cream: "#f4f6fa",
      creamDark: "#e2e8f2",
      ink: "#2c3a4d",
      inkLight: "#5c6b80",
      rose: "#b76e79",
      roseLight: "#e8c4c9",
      white: "#ffffff",
    },
  },
  {
    id: "modern-blush",
    name: "ມອເດີນ ບົວອ່ອນ",
    description: "ມິນິມອນ ທັນສະໄໝ ສີບົວອ່ອນ ສະອາດຕາ",
    variant: "modern",
    colors: {
      gold: "#d4a5b8",
      goldLight: "#f0d5e0",
      goldDark: "#b07a92",
      cream: "#fffafc",
      creamDark: "#f9eef2",
      ink: "#4a3f45",
      inkLight: "#8a7a82",
      rose: "#d98ba6",
      roseLight: "#f2d3de",
      white: "#ffffff",
    },
  },
  {
    id: "modern-sage",
    name: "ມອເດີນ ຂຽວສະເກດ",
    description: "ມິນິມອນ ສີຂຽວສະເກດ ສະຫງົບ ທຳມະຊາດ",
    variant: "modern",
    colors: {
      gold: "#8aa77e",
      goldLight: "#c9d8c2",
      goldDark: "#5f7d54",
      cream: "#fbfdf9",
      creamDark: "#eef3ea",
      ink: "#3a4036",
      inkLight: "#6f7a6a",
      rose: "#c98a9b",
      roseLight: "#ecc9d2",
      white: "#ffffff",
    },
  },
  {
    id: "floral-lavender",
    name: "ດອກໄມ້ ລາເວນເດີ",
    description: "ໂຣແມນຕິກ ສີລາເວນເດີ ອ່ອນຫວານ ດ້ວຍລາຍດອກໄມ້",
    variant: "floral",
    colors: {
      gold: "#a58fc9",
      goldLight: "#d8cce8",
      goldDark: "#7d63a8",
      cream: "#fbf9fe",
      creamDark: "#f0ebf8",
      ink: "#3f3a4a",
      inkLight: "#7a7288",
      rose: "#c98a9b",
      roseLight: "#ecc9d2",
      white: "#ffffff",
    },
  },
  {
    id: "floral-peach",
    name: "ດອກໄມ້ ສີໝາກກ້ຽງ",
    description: "ອົບອຸ່ນ ສີພີດ ກັບ ລາຍດອກໄມ້ ອ່ອນຫວານ",
    variant: "floral",
    colors: {
      gold: "#d9a06b",
      goldLight: "#f0d5b8",
      goldDark: "#b87a3e",
      cream: "#fef9f3",
      creamDark: "#f9efe2",
      ink: "#4a3d33",
      inkLight: "#85705f",
      rose: "#d98ba6",
      roseLight: "#f2d3de",
      white: "#ffffff",
    },
  },
  {
    id: "luxury-burgundy",
    name: "ຫຼູຫຼາ ບູກັນດີ",
    description: "ພື້ນຫຼັງເຂັ້ມ ສີແດງເຫຼົ້າ ກັບ ສີທອງ ຫຼູຫຼາສຸດ",
    variant: "luxury",
    colors: {
      gold: "#d4af37",
      goldLight: "#e8d48b",
      goldDark: "#c9a227",
      cream: "#2b1a20",
      creamDark: "#1e1216",
      ink: "#f2e8d5",
      inkLight: "#c4b3a0",
      rose: "#d98ba6",
      roseLight: "#55333f",
      white: "#35222a",
    },
  },
  {
    id: "luxury-emerald",
    name: "ຫຼູຫຼາ ມຣັກດ",
    description: "ພື້ນຫຼັງເຂັ້ມ ສີຂຽວມຣັກດ ກັບ ສີທອງ ສະຫງ່າງາມ",
    variant: "luxury",
    colors: {
      gold: "#c9a227",
      goldLight: "#e8d48b",
      goldDark: "#a8841f",
      cream: "#14241c",
      creamDark: "#0d1712",
      ink: "#e8f0e9",
      inkLight: "#9fb8a8",
      rose: "#b76e79",
      roseLight: "#3a2c38",
      white: "#1b2f24",
    },
  },
];

export function getTemplate(id: string): Template {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export interface DesignSettings {
  colors?: Partial<TemplateColors>;
}

/** Parse a wedding's design JSON safely. */
export function parseDesign(raw: string | null | undefined): DesignSettings {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as DesignSettings;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Resolve the effective color palette: template colors + design overrides. */
export function resolveColors(
  templateId: string,
  design: DesignSettings
): TemplateColors {
  const base = getTemplate(templateId).colors;
  return { ...base, ...(design.colors ?? {}) };
}