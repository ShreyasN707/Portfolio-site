import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Palette, Highlighter, Type, Baseline, X } from 'lucide-react';
import {
  applyStyleToSelection,
  PRESET_COLORS,
  FONT_SIZES,
  FONT_FAMILIES,
  getSavedSelectionRange,
  setSavedSelectionRange
} from '../utils/richText';
import { playHoverTick, playSelectClick } from '../utils/audio';

export default function RichTextEditorBox({
  initialHtml = '',
  onChange,
  placeholder = 'Write text here... Highlight any words with your mouse to change color, size, and font!'
}) {
  const editorRef = useRef(null);
  const rangeRef = useRef(null);
  const isInitialMount = useRef(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#39FF14');

  useEffect(() => {
    const handleSel = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        const anchor = sel.anchorNode;
        if (editorRef.current && (editorRef.current.contains(anchor) || anchor === editorRef.current)) {
          rangeRef.current = sel.getRangeAt(0).cloneRange();
          setSavedSelectionRange(rangeRef.current);
        }
      }
    };
    document.addEventListener('selectionchange', handleSel);
    window.addEventListener('mouseup', handleSel);
    return () => {
      document.removeEventListener('selectionchange', handleSel);
      window.removeEventListener('mouseup', handleSel);
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml || '';
      }
      isInitialMount.current = false;
      return;
    }

    if (editorRef.current && document.activeElement !== editorRef.current) {
      if (editorRef.current.innerHTML !== (initialHtml || '')) {
        editorRef.current.innerHTML = initialHtml || '';
      }
    }
  }, [initialHtml]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormat = (style) => {
    playSelectClick();
    applyStyleToSelection(
      style,
      () => {
        handleInput();
      },
      rangeRef.current
    );
  };

  return (
    <div className="rich-editor-wrapper">
      {/* Docked Google Docs-Style Toolbar */}
      <div className="rich-docked-toolbar" onMouseDown={(e) => e.preventDefault()}>
        {/* Font Family */}
        <div className="toolbar-dropdown-anchor">
          <button
            type="button"
            className={`docked-tool-btn ${showFontPicker ? 'active' : ''}`}
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
            className={`docked-tool-btn ${showSizePicker ? 'active' : ''}`}
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
            className={`docked-tool-btn ${showColorPicker ? 'active' : ''}`}
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

        <div className="docked-divider"></div>

        {/* Bold */}
        <button
          type="button"
          className="docked-tool-btn icon-only"
          onClick={() => handleFormat({ fontWeight: '800' })}
          onMouseEnter={playHoverTick}
          title="Bold"
        >
          <Bold size={13} />
        </button>

        {/* Italic */}
        <button
          type="button"
          className="docked-tool-btn icon-only"
          onClick={() => handleFormat({ fontStyle: 'italic' })}
          onMouseEnter={playHoverTick}
          title="Italic"
        >
          <Italic size={13} />
        </button>

        {/* Highlight */}
        <button
          type="button"
          className="docked-tool-btn icon-only"
          onClick={() => handleFormat({ backgroundColor: 'rgba(252, 211, 77, 0.28)' })}
          onMouseEnter={playHoverTick}
          title="Highlight Background"
        >
          <Highlighter size={13} />
        </button>

        {/* Clear */}
        <button
          type="button"
          className="docked-tool-btn icon-only"
          onClick={() => handleFormat({ clear: true })}
          onMouseEnter={playHoverTick}
          title="Clear Style"
        >
          <X size={13} />
        </button>

        <span className="docked-hint">Select text with mouse to style</span>
      </div>

      {/* ContentEditable Box */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-rich-editable="true"
        className="rich-editor-content-box"
        placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleInput}
      />
    </div>
  );
}
