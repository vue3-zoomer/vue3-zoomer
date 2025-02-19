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
}

export interface ZoomImgProps extends ZoomImgCoreProps {
  zoomType?: "move" | "drag";
  showZoomBtns?: boolean;
  showImgMap?: boolean;
}
