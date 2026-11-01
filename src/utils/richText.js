export const PRESET_COLORS = [
  { name: 'Dark Gold', color: '#70551E' },
  { name: 'Royal Gold', color: '#B89A5A' },
  { name: 'Deep Atlas Navy', color: '#0E1D61' },
  { name: 'Warm Ivory', color: '#E8E0D2' },
  { name: 'Emerald Green', color: '#16a34a' },
  { name: 'Coral Rose', color: '#fb7185' },
  { name: 'Purple Lavender', color: '#c084fc' },
  { name: 'Bright White', color: '#ffffff' }
];

export const FONT_SIZES = [
  { label: 'Small (13px)', size: '0.85rem' },
  { label: 'Normal (16px)', size: '1rem' },
  { label: 'Medium (19px)', size: '1.2rem' },
  { label: 'Large (24px)', size: '1.5rem' },
  { label: 'X-Large (28px)', size: '1.75rem' },
  { label: 'Huge (34px)', size: '2.1rem' },
  { label: 'Jumbo (42px)', size: '2.6rem' },
  { label: 'Display (52px)', size: '3.25rem' },
  { label: 'Titan (64px)', size: '4rem' }
];

export const FONT_FAMILIES = [
  { label: 'Cute Sans (Outfit)', font: 'var(--font-cute)' },
  { label: 'Code Mono (JetBrains)', font: 'var(--font-mono)' },
  { label: 'Classic Serif (Georgia)', font: 'Georgia, serif' }
];

export function applyStyleToSelection(styles, onContentChange) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const anchorNode = selection.anchorNode;
  const element = anchorNode?.nodeType === 1 ? anchorNode : anchorNode?.parentElement;
  const editableParent = element?.closest('[data-rich-editable="true"], .rich-inline-editable, [contenteditable="true"]');

  if (styles.clear) {
    const text = range.toString();
    const parentSpan = element?.closest('span');
    if (parentSpan && parentSpan.textContent === text) {
      parentSpan.replaceWith(document.createTextNode(text));
    } else {
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
    if (editableParent) {
      editableParent.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (onContentChange) onContentChange(editableParent, element);
    return;
  }

  const span = document.createElement('span');
  if (styles.color) span.style.color = styles.color;
  if (styles.fontSize) span.style.fontSize = styles.fontSize;
  if (styles.fontFamily) span.style.fontFamily = styles.fontFamily;
  if (styles.fontWeight) span.style.fontWeight = styles.fontWeight;
  if (styles.fontStyle) span.style.fontStyle = styles.fontStyle;
  if (styles.backgroundColor) {
    span.style.backgroundColor = styles.backgroundColor;
    span.style.padding = '2px 5px';
    span.style.borderRadius = '4px';
  }

  try {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);

    // Keep the formatted text selected so owner can apply multiple styles in succession
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);

    if (editableParent) {
      editableParent.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (onContentChange) onContentChange(editableParent, element);
  } catch (err) {
    console.error('Error applying rich text formatting:', err);
  }
}
