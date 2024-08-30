export function toObjectUrl(svgString: string) {
  return URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
}

export async function toImage(svgImageBuilder: string): Promise<HTMLImageElement> {
  const image_ = new Image();
  image_.src = toObjectUrl(svgImageBuilder);
  return new Promise(resolve => image_.addEventListener('load', () => resolve(image_)));
}
