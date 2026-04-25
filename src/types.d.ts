export interface PositionType {
  left: number;
  top: number;
}

export interface ZoomImgCoreProps {
  src: string;
  alt?: string;
  zoomScale?: number;
  trigger?: "click" | "hover";
  step?: number;
  persist?: boolean;
  rotate?: number;
}

export interface ZoomImgProps extends ZoomImgCoreProps {
  zoomType?: "move" | "drag";
  showZoomBtns?: boolean;
  showImgMap?: boolean;
  showImgMapInFullScreen?: boolean;
  imgMapRatio?: number;
  fullScreenMode?: boolean;
  closeButton?: boolean;
  closeOnClickOutside?: boolean;
  loading?: boolean;
}
