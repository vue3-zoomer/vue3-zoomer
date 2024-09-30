export type ImgPropsType = {
  zoomImg?: HTMLImageElement;
  scaledDimensions: {
    width: number;
    height: number;
  };
  bounds: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  ratios: {
    x: number;
    y: number;
  };
  eventPosition?: {
    x: number;
    y: number;
  };
  offsets: {
    x: number;
    y: number;
  };
  onLoadCallback: null | (() => void);
};

export type PositionType = {
  left: number;
  top: number;
};
