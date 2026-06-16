declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_META_PIXEL_ID: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Fix for react-facebook-pixel if needed
declare module 'react-facebook-pixel' {
    const ReactPixel: any;
    export default ReactPixel;
}
