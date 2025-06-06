// // Direct DOM manipulation for head updates with rich descriptions (SEO-friendly)
// import { formatMapString } from '@/utils/formatMapString';
// import { syncDescriptionService } from '../../services/syncDescriptionService';

// export const updateMapHelmet = (selectedMap: string | null, selectedLevelLabel: string) => {
//   console.log('[updateMapHelmet] Called with:', { selectedMap, selectedLevelLabel });
  
//   const pageTitle = selectedMap 
//     ? `${formatMapString(selectedMap)} - Pokémon Emerald Imperium Dex Nav`
//     : "Pokémon Emerald Imperium Dex Nav • Interactive Map Explorer";
  
//   // Get rich description synchronously (SEO-friendly)
//   const pageDescription = selectedMap 
//     ? syncDescriptionService.getMapDescriptionSync(selectedMap, selectedLevelLabel)
//     : "Interactive Dexnav for Pokemon Emerald Imperium. Discover Pokémon encounters, items, and locations across all regions.";

//   // Update document head directly
//   document.title = pageTitle;
//   console.log('[updateMapHelmet] Set title:', document.title);
//   console.log('[updateMapHelmet] Using description:', pageDescription.substring(0, 100) + '...');
  
//   // Update existing meta tags or create them if they don't exist
//   const updateMetaTag = (property: string, content: string, isProperty = false) => {
//     const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
//     let meta = document.querySelector(selector) as HTMLMetaElement;
    
//     if (!meta) {
//       meta = document.createElement('meta');
//       if (isProperty) {
//         meta.setAttribute('property', property);
//       } else {
//         meta.setAttribute('name', property);
//       }
//       document.head.appendChild(meta);
//     }
    
//     meta.setAttribute('content', content);
//   };

//   // Update all relevant meta tags with rich description
//   updateMetaTag('description', pageDescription);
//   updateMetaTag('og:title', pageTitle, true);
//   updateMetaTag('og:description', pageDescription, true);
//   updateMetaTag('og:type', 'website', true);
//   updateMetaTag('twitter:card', 'summary');
//   updateMetaTag('twitter:title', pageTitle);
//   updateMetaTag('twitter:description', pageDescription);
  
//   console.log('[updateMapHelmet] Meta tags updated with rich description');
// };
