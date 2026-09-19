import { toPng } from 'html-to-image';

export interface CardExportOptions {
  date: string;
  messageText: string;
  isDark?: boolean;
}

export const formatDateArabic = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ar-EG-u-nu-latn', options);
};

export async function generateCardImage({ date, messageText, isDark }: CardExportOptions): Promise<string> {
  const isDarkMode = isDark !== undefined 
    ? isDark 
    : document.documentElement.getAttribute('data-theme') === 'dark' || 
      (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const text = messageText || '';
  const textLen = text.length;

  // Responsive font size & line height based on message length
  let fontSize = 26;
  let lineHeight = 2.0;

  if (textLen < 120) {
    fontSize = 32;
    lineHeight = 2.2;
  } else if (textLen < 300) {
    fontSize = 28;
    lineHeight = 2.0;
  } else if (textLen < 700) {
    fontSize = 24;
    lineHeight = 1.9;
  } else if (textLen < 1200) {
    fontSize = 21;
    lineHeight = 1.8;
  } else {
    fontSize = 19;
    lineHeight = 1.75;
  }

  // Card dimensions: fixed comfortable width for social/mobile sharing
  const cardWidth = 850;

  const bg = isDarkMode ? '#1F162B' : '#F3E8FF';
  const textColor = isDarkMode ? '#F8F5FF' : '#2D1B3A';
  const wineColor = isDarkMode ? '#B99AE6' : '#6C3FA0';
  const roseColor = '#B99AE6';
  const borderColor = isDarkMode ? 'rgba(185, 154, 230, 0.3)' : 'rgba(185, 154, 230, 0.4)';

  // Hidden container out of screen view
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: -99999px;
    width: ${cardWidth}px;
    min-width: ${cardWidth}px;
    max-width: ${cardWidth}px;
    z-index: -99999;
    pointer-events: none;
    box-sizing: border-box;
  `;

  // The actual card
  const card = document.createElement('div');
  card.style.cssText = `
    width: ${cardWidth}px;
    min-width: ${cardWidth}px;
    max-width: ${cardWidth}px;
    background-color: ${bg};
    border-radius: 32px;
    border: 1px solid ${borderColor};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    padding: 60px 48px 48px 48px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    direction: rtl;
    overflow: hidden;
  `;

  // Floral corner helper
  const createCorner = (posStyle: string, transform: string) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = `
      position: absolute;
      width: 48px;
      height: 48px;
      fill: ${roseColor};
      opacity: 0.7;
      ${posStyle};
      transform: ${transform};
    `;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0,0 C 20,0 40,10 50,30 C 60,10 80,0 100,0 C 80,20 70,40 50,50 C 70,60 80,80 100,100 C 80,100 60,90 50,70 C 40,90 20,100 0,100 C 20,80 30,60 50,50 C 30,40 20,20 0,0 Z');
    svg.appendChild(path);
    return svg;
  };

  card.appendChild(createCorner('top: 14px; left: 14px', 'none'));
  card.appendChild(createCorner('top: 14px; right: 14px', 'scaleX(-1)'));
  card.appendChild(createCorner('bottom: 14px; left: 14px', 'scaleY(-1)'));
  card.appendChild(createCorner('bottom: 14px; right: 14px', 'scale(-1)'));

  // Top & Bottom gradient accent lines
  const topLine = document.createElement('div');
  topLine.style.cssText = `
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 160px;
    height: 3px;
    background: linear-gradient(to right, transparent, ${roseColor}, transparent);
    opacity: 0.6;
  `;
  card.appendChild(topLine);

  const bottomLine = document.createElement('div');
  bottomLine.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 160px;
    height: 3px;
    background: linear-gradient(to right, transparent, ${roseColor}, transparent);
    opacity: 0.6;
  `;
  card.appendChild(bottomLine);

  // Date Header
  const dateHeader = document.createElement('div');
  dateHeader.style.cssText = `
    font-family: var(--font-aref), serif, Arial;
    font-size: 32px;
    font-weight: bold;
    color: ${wineColor};
    margin-bottom: 28px;
    text-align: center;
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
  `;
  dateHeader.innerHTML = `
    <span style="color: ${roseColor}; opacity: 0.7; font-size: 24px;">❦</span>
    <span>${formatDateArabic(date)}</span>
    <span style="color: ${roseColor}; opacity: 0.7; font-size: 24px; display: inline-block; transform: scaleX(-1);">❦</span>
  `;
  card.appendChild(dateHeader);

  // Message Text
  const msgEl = document.createElement('div');
  msgEl.style.cssText = `
    font-family: var(--font-markazi), Arial, sans-serif;
    font-size: ${fontSize}px;
    line-height: ${lineHeight};
    font-weight: 600;
    color: ${textColor};
    text-align: center;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    direction: rtl;
    position: relative;
    z-index: 2;
  `;
  msgEl.innerText = text;
  card.appendChild(msgEl);

  // Decorative subtle footer
  const footer = document.createElement('div');
  footer.style.cssText = `
    font-family: var(--font-markazi), Arial, sans-serif;
    font-size: 18px;
    color: ${roseColor};
    opacity: 0.6;
    margin-top: 32px;
    text-align: center;
    position: relative;
    z-index: 2;
  `;
  footer.innerText = '❤ رسائل ليلى';
  card.appendChild(footer);

  container.appendChild(card);
  document.body.appendChild(container);

  // Ensure fonts & layout render
  await document.fonts?.ready;
  await new Promise(r => setTimeout(r, 150));

  const finalHeight = card.offsetHeight;

  try {
    const dataUrl = await toPng(card, {
      cacheBust: true,
      pixelRatio: 2,
      width: cardWidth,
      height: finalHeight,
      style: {
        width: `${cardWidth}px`,
        minWidth: `${cardWidth}px`,
        maxWidth: `${cardWidth}px`,
        height: `${finalHeight}px`,
        transform: 'none',
        left: '0',
        top: '0',
        position: 'static',
        margin: '0',
      }
    });

    return dataUrl;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
