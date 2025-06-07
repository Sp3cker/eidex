// Direct DOM manipulation for head updates with rich descriptions (SEO-friendly)
import { formatMapString } from "@/utils/formatMapString";
import { syncDescriptionService } from "../../services/syncDescriptionService";

export const updateMapHelmet = (
  selectedMap: string | null,
  selectedLevelLabel: string
) => {
  const pageTitle = selectedMap
    ? `${formatMapString(selectedMap)} - Pokémon Emerald Imperium Dex Nav`
    : "Pokémon Emerald Imperium Dex Nav • Interactive Map Explorer";

  const canonicalUrl = selectedMap
    ? `${window.location.origin}/map/${selectedMap}`
    : window.location.origin;

  // Get rich description synchronously (SEO-friendly)
  const pageDescription = selectedMap
    ? syncDescriptionService.getMapDescriptionSync(selectedMap, selectedLevelLabel)
    : "Interactive Dexnav for Pokemon Emerald Imperium. Discover Pokémon encounters, items, and locations across all regions.";

  // Update document head directly
  document.title = pageTitle;

  // Update existing meta tags/links or create them if they don't exist
  const updateHeadElement = (
    type: 'meta' | 'link',
    selector: string,
    attributes: Record<string, string>
  ) => {
    let element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement;

    if (!element) {
      element = document.createElement(type);
      Object.keys(attributes).forEach(key => {
        if (key !== 'content' && key !== 'href') {
          element.setAttribute(key, attributes[key]);
        }
      });
      document.head.appendChild(element);
    }

    // Set the content/href attribute
    if (type === 'meta' && attributes.content) {
      element.setAttribute('content', attributes.content);
    } else if (type === 'link' && attributes.href) {
      element.setAttribute('href', attributes.href);
    }
  };

  // Update all meta tags and canonical link
  updateHeadElement('meta', 'meta[name="description"]', { name: 'description', content: pageDescription });
  updateHeadElement('meta', 'meta[property="og:title"]', { property: 'og:title', content: pageTitle });
  updateHeadElement('meta', 'meta[property="og:description"]', { property: 'og:description', content: pageDescription });
  updateHeadElement('meta', 'meta[property="og:type"]', { property: 'og:type', content: 'website' });
  updateHeadElement('meta', 'meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  updateHeadElement('meta', 'meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
  updateHeadElement('meta', 'meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
  updateHeadElement('meta', 'meta[name="twitter:description"]', { name: 'twitter:description', content: pageDescription });
  updateHeadElement('link', 'link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

  // console.log("[updateMapHelmet] Meta tags and canonical link updated");
};