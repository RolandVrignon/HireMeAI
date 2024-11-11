declare module 'tailwindcss/lib/util/flattenColorPalette' {
    // Define the type for flattenColorPalette, assuming it returns an object of colors
    const flattenColorPalette: (colors: Record<string, string>) => Record<string, string>;
    export default flattenColorPalette;
  }
  