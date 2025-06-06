// Default helmet setup for different routes
export const setDefaultHelmet = (route: "home" | "dex" | "map") => {
  const configs = {
    home: {
      title: "EIMap - Interactive Pokémon Emerald Imperium Map",
      description:
        "Pokémon Emerald Imperium Dexnav. Pokémon locations, items, encounter rates for the Hoenn region.",
    },
    dex: {
      title: "Pokédex - Pokémon Emerald Imperium",
      description:
        "Emerald Imperium Pokédex. Filter Pokémon by type, stats, and more. View detailed information and shiny forms.",
    },
    map: {
      title: "Pokémon Map Explorer",
      description:
        "The world map from Pokémon Emerald Imperium. Explore Pokémon encounters, items, and locations across the region.",
    },
  };

  const config = configs[route];
  // change HTML head
  document.title = config.title;

  // Update or add meta tags
  const updateMetaTag = (
    property: string,
    content: string,
    isProperty = false,
  ) => {
    const selector = isProperty
      ? `meta[property="${property}"]`
      : `meta[name="${property}"]`;
    let metaElement = document.querySelector(selector) as HTMLMetaElement;

    if (!metaElement) {
      metaElement = document.createElement("meta");
      if (isProperty) {
        metaElement.setAttribute("property", property);
      } else {
        metaElement.setAttribute("name", property);
      }
      document.head.appendChild(metaElement);
    }

    metaElement.setAttribute("content", content);
  };

  // Update all relevant meta tags
  updateMetaTag("description", config.description);
  updateMetaTag("og:title", config.title, true);
  updateMetaTag("og:description", config.description, true);
  updateMetaTag("og:type", "website", true);
  updateMetaTag("twitter:card", "summary");
  updateMetaTag("twitter:title", config.title);
  updateMetaTag("twitter:description", config.description);
};
