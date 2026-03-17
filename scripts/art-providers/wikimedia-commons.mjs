import { downloadToFile } from './utils.mjs';

const stripHtml = (value) => String(value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const buildCandidate = (page, imageInfo) => {
  const metadata = imageInfo.extmetadata ?? {};
  const licenseShortName = stripHtml(metadata.LicenseShortName?.value);
  const attribution = stripHtml(metadata.Artist?.value) || stripHtml(metadata.Credit?.value) || page.title;

  return {
    provider: 'wikimedia-commons',
    sourceUrl: page.fullurl,
    assetUrl: imageInfo.url,
    attribution,
    license: licenseShortName,
    rawMetadata: {
      artist: stripHtml(metadata.Artist?.value),
      credit: stripHtml(metadata.Credit?.value),
      licenseShortName,
    },
  };
};

export const createWikimediaCommonsProvider = ({ userAgent }) => ({
  name: 'wikimedia-commons',
  async search({ card }) {
    const searchQuery = `${card.name} ${card.variant ?? ''} anime`;
    const url = new URL('https://commons.wikimedia.org/w/api.php');
    url.searchParams.set('action', 'query');
    url.searchParams.set('generator', 'search');
    url.searchParams.set('gsrsearch', searchQuery);
    url.searchParams.set('gsrnamespace', '6');
    url.searchParams.set('gsrlimit', '5');
    url.searchParams.set('prop', 'imageinfo|info');
    url.searchParams.set('iiprop', 'url|extmetadata');
    url.searchParams.set('inprop', 'url');
    url.searchParams.set('format', 'json');
    url.searchParams.set('origin', '*');

    const response = await fetch(url, { headers: { 'user-agent': userAgent } });
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages ?? {});
    return pages
      .map((page) => {
        const imageInfo = page.imageinfo?.[0];
        if (!imageInfo?.url) return null;
        if (!/(\.png|\.jpe?g|\.webp)$/i.test(imageInfo.url)) return null;
        return buildCandidate(page, imageInfo);
      })
      .filter(Boolean);
  },
  async download(candidate, destinationAbsolutePath) {
    await downloadToFile(candidate.assetUrl, destinationAbsolutePath, userAgent);
    return destinationAbsolutePath;
  },
});
