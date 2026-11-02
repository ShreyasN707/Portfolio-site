import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Palette, Highlighter, Type, Baseline, X } from 'lucide-react';
import {
  PRESET_COLORS,
  FONT_SIZES,
  FONT_FAMILIES,
  applyStyleToSelection,
  getSavedSelectionRange,
  setSavedSelectionRange
} from '../utils/richText';
import { playHoverTick, playSelectClick } from '../utils/audio';

export default function RichTextFloatingBar({ onApplyFormat }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#0E1D61');

  const barRef = useRef(null);
  const rangeRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setVisible(false);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length === 0) {
        setVisible(false);
        return;
      }

      // Check if selection is inside an interactive terminal element or editor
      const anchorNode = selection.anchorNode;
      const element = anchorNode?.nodeType === 1 ? anchorNode : anchorNode?.parentElement;
      const insideTerminal = element?.closest('.mac-window, .mac-terminal-page, .admin-modal-card, [data-rich-editable="true"], .rich-inline-editable');

      if (!insideTerminal) {
        setVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      rangeRef.current = range.cloneRange();
      setSavedSelectionRange(rangeRef.current);
      const rect = range.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        // Position centered above the selected text
        const horizontalCenter = rect.left + rect.width / 2;
        const left = Math.max(160, Math.min(window.innerWidth - 160, horizontalCenter));
        // If too close to viewport top, show below selection; otherwise show above
        const top = rect.top < 70 ? rect.bottom + 12 : rect.top - 54;

        setPosition({ top, left });
        setVisible(true);
      }
    };

    const handleMouseUp = () => {
      // Small timeout to allow selection to settle
      setTimeout(updatePosition, 30);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        // If clicking inside the toolbar, keep visible
        const activeEl = document.activeElement;
        if (barRef.current && (barRef.current.contains(activeEl) || barRef.current.contains(document.getSelection()?.anchorNode))) {
          return;
        }
      }
    };

    const handleMouseDown = (e) => {
      // If clicking inside the floating toolbar, do not hide it
      if (barRef.current && barRef.current.contains(e.target)) {
        return;
      }
      // If clicking elsewhere, close popovers
      setShowColorPicker(false);
      setShowSizePicker(false);
      setShowFontPicker(false);
    };

    const handleScroll = () => {
      if (visible) {
        updatePosition();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [visible]);

  const handleFormat = (style) => {
    playSelectClick();
    applyStyleToSelection(style, onApplyFormat, rangeRef.current);
  };

  if (!visible) return null;

  const content = (
    <div
      ref={barRef}
      className="rich-floating-toolbar fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        position: 'fixed',
        zIndex: 999999
      }}
      onMouseDown={(e) => e.preventDefault()} // CRUCIAL: prevents mouse selection from collapsing!
    >
      <div className="toolbar-header-hint">
        <span>Format Selection</span>
      </div>

      <div className="toolbar-btn-group">
        {/* Font Family Dropdown */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`toolbar-btn ${showFontPicker ? 'active' : ''}`}
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              setShowColorPicker(false);
              setShowSizePicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Change Font Family"
          >
            <Type size={13} />
            <span>Font</span>
          </button>

          {showFontPicker && (
            <div className="toolbar-popover-menu fade-in">
              {FONT_FAMILIES.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  className="popover-item"
                  style={{ fontFamily: f.font }}
                  onClick={() => {
                    handleFormat({ fontFamily: f.font });
                    setShowFontPicker(false);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`toolbar-btn ${showSizePicker ? 'active' : ''}`}
            onClick={() => {
              setShowSizePicker(!showSizePicker);
              setShowFontPicker(false);
              setShowColorPicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Change Font Size"
          >
            <Baseline size={13} />
            <span>Size</span>
          </button>

          {showSizePicker && (
            <div className="toolbar-popover-menu fade-in">
              {FONT_SIZES.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="popover-item"
                  style={{ fontSize: s.size }}
                  onClick={() => {
                    handleFormat({ fontSize: s.size });
                    setShowSizePicker(false);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Palette Dropdown */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`toolbar-btn color-btn ${showColorPicker ? 'active' : ''}`}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowFontPicker(false);
              setShowSizePicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Change Text Color"
          >
            <Palette size={13} />
            <span>Color</span>
          </button>

          {showColorPicker && (
            <div className="toolbar-color-palette fade-in" onMouseDown={(e) => e.stopPropagation()}>
              <div className="color-swatches-grid">
                {PRESET_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className="color-swatch-dot"
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleFormat({ color: c.color });
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>

              <div className="custom-color-row" onMouseDown={(e) => e.stopPropagation()}>
                <span className="custom-color-label">Custom:</span>
                <input
                  type="color"
                  className="custom-color-input"
                  value={customColor}
                  onFocus={() => getSavedSelectionRange()}
                  onMouseDown={(e) => {
                    getSavedSelectionRange();
                    e.stopPropagation();
                  }}
                  onInput={(e) => {
                    setCustomColor(e.target.value);
                    handleFormat({ color: e.target.value });
                  }}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    handleFormat({ color: e.target.value });
                  }}
                />
                <input
                  type="text"
                  className="custom-hex-input"
                  value={customColor}
                  placeholder="#0E1D61"
                  onFocus={() => getSavedSelectionRange()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      handleFormat({ color: e.target.value });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleFormat({ color: customColor });
                      setShowColorPicker(false);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="toolbar-divider"></div>

        {/* Bold */}
        <button
          type="button"
          className="toolbar-btn icon-only"
          onClick={() => handleFormat({ fontWeight: '800' })}
          onMouseEnter={playHoverTick}
          title="Bold"
        >
          <Bold size={13} />
        </button>

        {/* Italic */}
        <button
          type="button"
          className="toolbar-btn icon-only"
          onClick={() => handleFormat({ fontStyle: 'italic' })}
          onMouseEnter={playHoverTick}
          title="Italic"
        >
          <Italic size={13} />
        </button>

        {/* Highlight Background */}
        <button
          type="button"
          className="toolbar-btn icon-only"
          onClick={() => handleFormat({ backgroundColor: 'rgba(252, 211, 77, 0.28)' })}
          onMouseEnter={playHoverTick}
          title="Highlight Background"
        >
          <Highlighter size={13} />
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          className="toolbar-btn icon-only clear-btn"
          onClick={() => handleFormat({ clear: true })}
          onMouseEnter={playHoverTick}
          title="Clear Formatting (Plain Text)"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
