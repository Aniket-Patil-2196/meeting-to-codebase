import { useState } from 'react';

/**
 * Recursive VS Code-style file tree component.
 * Renders folders as expandable nodes with 📁 icons
 * and files as leaf nodes with 📄 icons.
 *
 * @param {Object|Array} node - Object = folder, Array = list of files
 * @param {string} name - Display name of this node (folder name)
 * @param {number} depth - Current nesting depth for indentation
 */

/* File extension → icon mapping for a richer visual */
const FILE_ICONS = {
  '.js': '⚡',
  '.jsx': '⚛️',
  '.ts': '🔷',
  '.tsx': '⚛️',
  '.py': '🐍',
  '.json': '📦',
  '.css': '🎨',
  '.html': '🌐',
  '.md': '📝',
  '.env': '🔒',
};

function getFileIcon(filename) {
  const ext = filename.substring(filename.lastIndexOf('.'));
  return FILE_ICONS[ext] || '📄';
}

function FolderNode({ name, node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth < 2);

  /* If node is an array, render each string as a file */
  if (Array.isArray(node)) {
    return (
      <div style={{ paddingLeft: depth * 16 }}>
        {node.map((file, index) => (
          <div
            key={`${file}-${index}`}
            className="flex items-center gap-2 py-1 px-2 rounded transition-colors duration-150 cursor-default group"
            style={{
              paddingLeft: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-sm flex-shrink-0">{getFileIcon(file)}</span>
            <span
              className="text-sm"
              style={{
                color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
              }}
            >
              {file}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* If node is an object, render as a folder */
  if (typeof node === 'object' && node !== null) {
    return (
      <div style={{ paddingLeft: depth * 16 }}>
        {/* Folder header */}
        <div
          className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer select-none transition-colors duration-150"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {/* Chevron */}
          <span
            className="text-xs transition-transform duration-200 flex-shrink-0"
            style={{
              color: 'var(--text-muted)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              display: 'inline-block',
              width: '12px',
            }}
          >
            ▶
          </span>

          {/* Folder icon */}
          <span className="text-sm flex-shrink-0">{isOpen ? '📂' : '📁'}</span>

          {/* Folder name */}
          <span
            className="text-sm font-semibold"
            style={{
              color: 'var(--accent-green)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
            }}
          >
            {name}
          </span>

          {/* Item count badge */}
          <span
            className="text-xs ml-auto"
            style={{ color: 'var(--text-muted)', fontSize: '11px' }}
          >
            {Object.keys(node).length} items
          </span>
        </div>

        {/* Children */}
        {isOpen && (
          <div
            className="border-l ml-3"
            style={{
              borderColor: 'var(--border-subtle)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {Object.entries(node).map(([key, value]) => (
              <FolderNode
                key={key}
                name={key}
                node={value}
                depth={1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

/**
 * Top-level FolderTree wrapper.
 * Receives the full folder structure object as props.
 */
export default function FolderTree({ structure }) {
  if (!structure || Object.keys(structure).length === 0) {
    return (
      <div
        className="text-center py-8"
        style={{ color: 'var(--text-muted)' }}
      >
        No folder structure generated.
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-subtle)',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* Title bar (like VS Code explorer) */}
      <div
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <span>📂</span>
        <span>Explorer</span>
      </div>

      {/* Tree content */}
      <div className="p-3">
        {Object.entries(structure).map(([key, value]) => (
          <FolderNode key={key} name={key} node={value} depth={0} />
        ))}
      </div>
    </div>
  );
}
