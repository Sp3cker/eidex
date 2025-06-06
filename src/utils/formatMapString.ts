export function formatMapString(mapNameFromJson: string) {
  return (
    mapNameFromJson
      .replace(/^MAP_/, "") // Remove 'MAP_' prefix
      // .toLowerCase() // Convert to lowercase
      .replace(
        /([A-Z]+)_?/g,
        (_, p1) => p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase() + " ",
      )
      .trim()
      .replace(/(^|_)([a-z])/g, (_: any, __: any, letter: string) =>
        letter.toUpperCase(),
      ) // Capitalize first letter and after underscores
  );
}