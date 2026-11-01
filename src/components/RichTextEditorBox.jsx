import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Palette, Highlighter, Type, Baseline, X } from 'lucide-react';
import {
  applyStyleToSelection,
  PRESET_COLORS,
  FONT_SIZES,
  FONT_FAMILIES
} from '../utils/richText';
import { playHoverTick, playSelectClick } from '../utils/audio';

export default function RichTextEditorBox({
  initialHtml = '',
  onChange,
  placeholder = 'Write text here... Highlight any words with your mouse to change color, size, and font!'
}) {
  const editorRef = useRef(null);
  const isInitialMount = useRef(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#B89A5A');

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
    applyStyleToSelection(style, () => {
      handleInput();
    });
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
            <div className="toolbar-color-palette fade-in">
              <div className="color-swatches-grid">
                {PRESET_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className="color-swatch-dot"
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                    onClick={() => {
                      handleFormat({ color: c.color });
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <div className="custom-color-row">
                <span className="custom-color-label">Custom:</span>
                <input
                  type="color"
                  className="custom-color-input"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    handleFormat({ color: e.target.value });
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
