declare module 'react-facebook-pixel' {
  const ReactPixel: {
    init: (pixelId: string, advancedMatching?: object, options?: object) => void;
    pageView: () => void;
    track: (title: string, data?: object) => void;
    trackCustom: (event: string, data?: object) => void;
    grantConsent: () => void;
    revokeConsent: () => void;
  };
  export default ReactPixel;
}
