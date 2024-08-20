export function toObjectUrl(svgString: string) {
  return URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
}

export async function toImage(svgImageBuilder: string): Promise<HTMLImageElement> {
  const image_ = new Image();
  image_.src = toObjectUrl(svgImageBuilder);
  return new Promise(resolve => image_.addEventListener('load', () => resolve(image_)));
}

export async function toImageData(svgString: string): Promise<ImageData> {
  const image_ = await toImage(svgString);
  const canvas = new OffscreenCanvas(image_.width, image_.height);
  const context = canvas.getContext('2d')!;
  // @ts-ignore
  context.drawImage(image_, 0, 0);
  // @ts-ignore
  return context.getImageData(0, 0, image_.width, image_.height);
}

//TODO: Consider removing if I don't end up using it anywhere
export async function toHeightmap(svgString: string, scale_: number): Promise<number[]> {
  const imageData = await toImageData(svgString);
  return [...imageData.data]
    .filter((value, index) => !(index % 4))
    .map(value => {
      return (value / 255 - 0.5) * scale_;
    });
}
