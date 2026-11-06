import { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Palette,
  Highlighter,
  Type,
  Baseline,
  X,
  ArrowUpDown
} from 'lucide-react';
import {
  PRESET_COLORS,
  FONT_SIZES,
  FONT_FAMILIES,
  applyStyleToSelection,
  getSavedSelectionRange,
  setSavedSelectionRange
} from '../utils/richText';
import { playHoverTick, playSelectClick } from '../utils/audio';

export default function AdminDocsToolbar({ onApplyFormat, onOpenReorderModal }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#39FF14');
  const rangeRef = useRef(null);

  useEffect(() => {
    const handleSel = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        rangeRef.current = sel.getRangeAt(0).cloneRange();
        setSavedSelectionRange(rangeRef.current);
      }
    };
    document.addEventListener('selectionchange', handleSel);
    window.addEventListener('mouseup', handleSel);
    window.addEventListener('touchend', handleSel);
    return () => {
      document.removeEventListener('selectionchange', handleSel);
      window.removeEventListener('mouseup', handleSel);
      window.removeEventListener('touchend', handleSel);
    };
  }, []);

  const handleFormat = (style) => {
    playSelectClick();
    applyStyleToSelection(style, onApplyFormat, rangeRef.current);
  };

  return (
    <div className="admin-docs-docked-bar" onMouseDown={(e) => e.preventDefault()}>
      <div className="docs-bar-tools">
        <span className="docs-bar-title-tag">STYLE SELECTION</span>

        {/* Font Family */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`admin-tool-pill ${showFontPicker ? 'active' : ''}`}
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              setShowColorPicker(false);
              setShowSizePicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Font Family"
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

        {/* Font Size */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`admin-tool-pill ${showSizePicker ? 'active' : ''}`}
            onClick={() => {
              setShowSizePicker(!showSizePicker);
              setShowFontPicker(false);
              setShowColorPicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Font Size"
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

        {/* Color Palette */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`admin-tool-pill color-pill ${showColorPicker ? 'active' : ''}`}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowFontPicker(false);
              setShowSizePicker(false);
            }}
            onMouseEnter={playHoverTick}
            title="Text Color"
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
                  placeholder="#39FF14"
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

        <div className="docs-bar-divider" />

        {/* Bold */}
        <button
          type="button"
          className="admin-tool-pill icon-only"
          onClick={() => handleFormat({ fontWeight: '800' })}
          onMouseEnter={playHoverTick}
          title="Bold Selection"
        >
          <Bold size={13} />
        </button>

        {/* Italic */}
        <button
          type="button"
          className="admin-tool-pill icon-only"
          onClick={() => handleFormat({ fontStyle: 'italic' })}
          onMouseEnter={playHoverTick}
          title="Italic Selection"
        >
          <Italic size={13} />
        </button>

        {/* Highlight */}
        <button
          type="button"
          className="admin-tool-pill icon-only"
          onClick={() => handleFormat({ backgroundColor: 'rgba(252, 211, 77, 0.28)' })}
          onMouseEnter={playHoverTick}
          title="Highlight Background"
        >
          <Highlighter size={13} />
        </button>

        {/* Clear Style */}
        <button
          type="button"
          className="admin-tool-pill icon-only clear"
          onClick={() => handleFormat({ clear: true })}
          onMouseEnter={playHoverTick}
          title="Clear Formatting"
        >
          <X size={13} />
        </button>
      </div>

      <div className="docs-bar-right">
        <span className="docs-bar-mouse-hint">
          Tip: Select any text below with mouse to style it!
        </span>

        {onOpenReorderModal && (
          <button
            type="button"
            className="reorder-tabs-btn"
            onClick={onOpenReorderModal}
            onMouseEnter={playHoverTick}
            title="Reorder Tabs (Change order of About, Skills, Projects, Contact & Custom tabs)"
          >
            <ArrowUpDown size={13} />
            <span>Reorder Tabs</span>
          </button>
        )}
      </div>
    </div>
  );
}
