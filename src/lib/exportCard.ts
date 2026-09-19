import { toPng } from 'html-to-image';

export interface CardExportOptions {
  date: string;
  messageText: string;
  isDark?: boolean;
}

import { formatDateArabic } from './date';

function splitTextIntoBalancedColumns(text: string, cols: number): string[] {
  if (cols <= 1) return [text];
  const trimmed = text.trim();
  if (!trimmed) return [text];

  const lines = trimmed.split('\n');
  if (lines.length >= cols * 4) {
    const lineWeights = lines.map(l => Math.max(1, Math.ceil(l.length / 35)));
    const totalWeight = lineWeights.reduce((a, b) => a + b, 0);
    const targetWeight = totalWeight / cols;

    const result: string[] = [];
    let currentChunk: string[] = [];
    let currentWeight = 0;

    for (let i = 0; i < lines.length; i++) {
      const w = lineWeights[i];
      if (result.length < cols - 1 && currentWeight + w >= targetWeight && currentChunk.length > 0) {
        result.push(currentChunk.join('\n'));
        currentChunk = [lines[i]];
        currentWeight = w;
      } else {
        currentChunk.push(lines[i]);
        currentWeight += w;
      }
    }
    if (currentChunk.length > 0) result.push(currentChunk.join('\n'));
    return result;
  }

  // Split continuous text evenly by word boundaries so columns have identical character counts
  const words = trimmed.split(/(\s+)/);
  const totalChars = trimmed.length;
  const targetCharsPerCol = totalChars / cols;

  const result: string[] = [];
  let currentWords: string[] = [];
  let currentChars = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextChars = currentChars + word.length;
    if (result.length < cols - 1 && nextChars >= targetCharsPerCol && currentWords.length > 0) {
      result.push(currentWords.join('').trim());
      currentWords = [word.trimStart()];
      currentChars = word.length;
    } else {
      currentWords.push(word);
      currentChars = nextChars;
    }
  }
  if (currentWords.length > 0) result.push(currentWords.join('').trim());
  return result;
}

export async function generateCardImage({ date, messageText, isDark }: CardExportOptions): Promise<string> {
  const isDarkMode = isDark !== undefined
    ? isDark
    : document.documentElement.getAttribute('data-theme') === 'dark' ||
    (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const text = messageText || '';
  const lines = text.split('\n');
  const lineCount = lines.length;
  const msgLength = text.length;

  // Decide columns: 2 columns is ideal for long love letters, 3 only for massive texts/code
  let columns = 1;
  if (lineCount > 60 || msgLength > 3200) {
    columns = 3;
  } else if (lineCount > 15 || msgLength > 600) {
    columns = 2;
  } else {
    columns = 1;
  }

  let cardWidth = 850;
  if (columns === 3) {
    cardWidth = 1400;
  } else if (columns === 2) {
    cardWidth = 1150;
  } else {
    cardWidth = 850;
  }

  // Dynamic font sizing
  let fontSize = 24;
  let lineHeight = 1.9;

  if (columns === 3) {
    fontSize = lineCount > 90 ? 17 : 19;
    lineHeight = 1.65;
  } else if (columns === 2) {
    fontSize = lineCount > 35 ? 20 : 22;
    lineHeight = 1.8;
  } else {
    if (msgLength < 120) {
      fontSize = 32;
      lineHeight = 2.2;
    } else if (msgLength < 300) {
      fontSize = 28;
      lineHeight = 2.0;
    } else {
      fontSize = 24;
      lineHeight = 1.9;
    }
  }

  const bg = isDarkMode ? '#1F162B' : '#EDE3F1';
  const textColor = isDarkMode ? '#F8F5FF' : '#22102E';
  const wineColor = isDarkMode ? '#B99AE6' : '#5A2780';
  const roseColor = isDarkMode ? '#B99AE6' : '#8B4D9E';
  const borderColor = isDarkMode ? 'rgba(185, 154, 230, 0.3)' : 'rgba(90, 39, 128, 0.22)';

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
    width: 180px;
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
    width: 180px;
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

  // Columns Wrapper
  const msgWrap = document.createElement('div');
  msgWrap.style.cssText = `
    display: flex;
    flex-direction: row;
    width: 100%;
    direction: rtl;
    position: relative;
    z-index: 2;
    align-items: stretch;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 10px;
  `;

  const columnChunks = splitTextIntoBalancedColumns(text, columns);

  columnChunks.forEach((chunk, index) => {
    const colDiv = document.createElement('div');
    colDiv.style.cssText = `
      font-family: var(--font-markazi), Arial, sans-serif;
      font-size: ${fontSize}px;
      line-height: ${lineHeight};
      font-weight: 600;
      color: ${textColor};
      text-align: ${columns > 1 ? 'right' : 'center'};
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
      flex: 1 1 0;
      min-width: 0;
      direction: rtl;
      box-sizing: border-box;
      padding: ${columns > 1 ? '0 24px' : '0 40px'};
      ${index < columnChunks.length - 1 && columns > 1 ? `border-left: 1px solid ${borderColor};` : ''}
    `;
    colDiv.innerText = chunk;
    msgWrap.appendChild(colDiv);
  });

  card.appendChild(msgWrap);

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
  footer.innerText = '❤ رسايل لولو حبيبتي ';
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
