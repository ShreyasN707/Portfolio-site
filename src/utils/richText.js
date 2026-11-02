export const PRESET_COLORS = [
  { name: 'Deep Atlas Navy', color: '#0E1D61' },
  { name: 'Midnight Navy', color: '#070F33' },
  { name: 'Luminous Ivory', color: '#FAF7F2' },
  { name: 'Warm Parchment', color: '#E8E0D2' },
  { name: 'Pure White', color: '#FFFFFF' },
  { name: 'Royal Gold', color: '#B89A5A' },
  { name: 'Antique Gold', color: '#70551E' },
  { name: 'Radiant Gold', color: '#E0BC5C' },
  { name: 'Emerald Green', color: '#16a34a' },
  { name: 'Cyber Cyan', color: '#06b6d4' },
  { name: 'Coral Rose', color: '#fb7185' },
  { name: 'Purple Lavender', color: '#c084fc' }
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

let savedRange = null;

if (typeof window !== 'undefined') {
  const updateSavedRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  };
  document.addEventListener('selectionchange', updateSavedRange);
  window.addEventListener('mouseup', updateSavedRange);
  window.addEventListener('touchend', updateSavedRange);
}

export function getSavedSelectionRange() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    savedRange = sel.getRangeAt(0).cloneRange();
  }
  return savedRange;
}

export function setSavedSelectionRange(range) {
  if (range) {
    savedRange = range.cloneRange ? range.cloneRange() : range;
  }
}

export function applyStyleToSelection(styles, onContentChange, targetRange = null) {
  const selection = window.getSelection();
  let range = null;

  if (targetRange && !targetRange.collapsed) {
    range = targetRange;
  } else if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    range = selection.getRangeAt(0);
  } else if (savedRange && !savedRange.collapsed) {
    range = savedRange;
  }

  if (!range) return;

  const anchorNode = range.startContainer;
  const element = anchorNode?.nodeType === 1 ? anchorNode : anchorNode?.parentElement;
  const editableParent = element?.closest('[data-rich-editable="true"], .rich-inline-editable, [contenteditable="true"], [data-rich-field]');

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
  if (styles.color) {
    span.style.setProperty('color', styles.color, 'important');
  }
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
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    savedRange = newRange.cloneRange();

    if (editableParent) {
      editableParent.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (onContentChange) onContentChange(editableParent, element);
  } catch (err) {
    console.error('Error applying rich text formatting:', err);
  }
}
