export async function toImage(svgImageBuilder: string): Promise<HTMLImageElement> {
  const image_ = new Image();
  image_.src = URL.createObjectURL(new Blob([svgImageBuilder], { type: 'image/svg+xml' }));
  return new Promise(resolve => image_.addEventListener('load', () => resolve(image_)));
}
