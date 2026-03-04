"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sweetsData, categories, type SweetItem, type Category } from "./sweetsData";

const MAX_ITEMS = 18;

/* ─── Render item visual: image if available, otherwise emoji ─── */
function ItemVisual({ item, className }: { item: SweetItem; className?: string }) {
  const [imgError, setImgError] = useState(false);

  if (item.image && !imgError) {
    return (
      <img
        src={item.image}
        alt={item.name}
        className={`sweetbox-item-img ${className || ""}`}
        draggable={false}
        onError={() => setImgError(true)}
      />
    );
  }
  return <span className={className}>{item.emoji}</span>;
}

interface BoxItem {
  itemId: number;
  count: number;
}

interface GiftBox {
  items: BoxItem[];
  note: string;
  sender: string;
  recipient: string;
  createdAt: string;
}

/* ─── helpers ─── */
function encodeBox(box: GiftBox): string {
  return btoa(JSON.stringify(box));
}

function decodeBox(encoded: string): GiftBox | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

function totalCount(items: BoxItem[]): number {
  return items.reduce((sum, i) => sum + i.count, 0);
}

function getItem(id: number): SweetItem | undefined {
  return sweetsData.find((s) => s.id === id);
}

/* ─── saved boxes (localStorage) ─── */
function getSavedBoxes(): { id: string; box: GiftBox }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("sweetboxes") || "[]");
  } catch {
    return [];
  }
}

function saveBox(box: GiftBox): string {
  const id = Math.random().toString(36).slice(2, 10);
  const saved = getSavedBoxes();
  saved.unshift({ id, box });
  localStorage.setItem("sweetboxes", JSON.stringify(saved.slice(0, 50)));
  return id;
}

/* ─── Main Component ─── */
export default function SweetsBuilder() {
  const [stage, setStage] = useState<"pick" | "note" | "box" | "gallery">("pick");
  const [items, setItems] = useState<BoxItem[]>([]);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [inspect, setInspect] = useState<SweetItem | null>(null);
  const [note, setNote] = useState("");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedBoxes, setSavedBoxes] = useState<{ id: string; box: GiftBox }[]>([]);
  const [viewBox, setViewBox] = useState<GiftBox | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [greenery, setGreenery] = useState(0);
  const [itemOrder, setItemOrder] = useState<number[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  // Check URL for shared box on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("box");
    if (data) {
      const box = decodeBox(data);
      if (box) {
        setViewBox(box);
        setStage("box");
      }
    }
    setSavedBoxes(getSavedBoxes());
  }, []);

  useEffect(() => {
    if (stage === "box") {
      setTimeout(() => setAnimateIn(true), 100);
    } else {
      setAnimateIn(false);
    }
  }, [stage]);

  const total = totalCount(items);

  const addItem = useCallback(
    (item: SweetItem) => {
      if (total >= MAX_ITEMS) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.itemId === item.id);
        if (existing) {
          return prev.map((i) => (i.itemId === item.id ? { ...i, count: i.count + 1 } : i));
        }
        return [...prev, { itemId: item.id, count: 1 }];
      });
    },
    [total]
  );

  const removeItem = useCallback((itemId: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.itemId === itemId);
      if (!existing) return prev;
      if (existing.count <= 1) return prev.filter((i) => i.itemId !== itemId);
      return prev.map((i) => (i.itemId === itemId ? { ...i, count: i.count - 1 } : i));
    });
  }, []);

  const handleShare = () => {
    const box: GiftBox = {
      items,
      note,
      sender,
      recipient,
      createdAt: new Date().toISOString(),
    };
    const encoded = encodeBox(box);
    const url = `${window.location.origin}/sweets?box=${encoded}`;
    setShareUrl(url);
    const id = saveBox(box);
    setSavedBoxes(getSavedBoxes());
    void id;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fisher-Yates shuffle for bouquet arrangement
  const shuffleArrangement = useCallback((count: number) => {
    const indices = Array.from({ length: count }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setItemOrder(indices);
  }, []);

  const cycleGreenery = () => {
    setGreenery((prev) => (prev + 1) % 3);
  };

  const filtered = filter === "all" ? sweetsData : sweetsData.filter((s) => s.category === filter);

  const countMap: Record<number, number> = {};
  items.forEach((i) => {
    countMap[i.itemId] = i.count;
  });

  // Expand items for box grid
  const expandedItems: SweetItem[] = [];
  items.forEach((bi) => {
    const item = getItem(bi.itemId);
    if (item) {
      for (let i = 0; i < bi.count; i++) expandedItems.push(item);
    }
  });

  const boxToView = viewBox || {
    items,
    note,
    sender,
    recipient,
    createdAt: new Date().toISOString(),
  };
  const viewExpandedItems: SweetItem[] = [];
  boxToView.items.forEach((bi) => {
    const item = getItem(bi.itemId);
    if (item) {
      for (let i = 0; i < bi.count; i++) viewExpandedItems.push(item);
    }
  });

  // Split items by type for box view: flowers/hearts go in bouquet, sweets in candy box
  const bouquetItems = viewExpandedItems.filter((item) => item.category === "flowers" || item.category === "hearts");
  const sweetBoxItems = viewExpandedItems.filter((item) => item.category === "sweets");

  /* ─── Gallery View ─── */
  if (stage === "gallery") {
    return (
      <div className="sweetbox-container">
        <div className="sweetbox-header">
          <h1 className="sweetbox-title">🎁 Gift Box Gallery</h1>
          <p className="sweetbox-tagline">boxes saved by you & shared with love</p>
        </div>

        <button className="sweetbox-back-btn" onClick={() => setStage("pick")}>
          ← Back to Builder
        </button>

        {savedBoxes.length === 0 ? (
          <div className="sweetbox-empty-gallery">
            <p>No saved boxes yet. Create one and share it!</p>
          </div>
        ) : (
          <div className="sweetbox-gallery-grid">
            {savedBoxes.map(({ id, box }) => {
              const boxItems: SweetItem[] = [];
              box.items.forEach((bi) => {
                const item = getItem(bi.itemId);
                if (item) {
                  for (let i = 0; i < bi.count; i++) boxItems.push(item);
                }
              });
              return (
                <button
                  key={id}
                  className="sweetbox-gallery-card"
                  onClick={() => {
                    setViewBox(box);
                    setStage("box");
                  }}
                >
                  <div className="sweetbox-gallery-preview">
                    {boxItems.slice(0, 6).map((item, i) => (
                      <span key={i} className="sweetbox-gallery-emoji">
                        <ItemVisual item={item} />
                      </span>
                    ))}
                    {boxItems.length > 6 && (
                      <span className="sweetbox-gallery-more">+{boxItems.length - 6}</span>
                    )}
                  </div>
                  {box.recipient && (
                    <p className="sweetbox-gallery-recipient">To: {box.recipient}</p>
                  )}
                  <p className="sweetbox-gallery-date">
                    {new Date(box.createdAt).toLocaleDateString()}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ─── Box View (Bouquet-Style) ─── */
  if (stage === "box") {
    return (
      <div className="sweetbox-container">
        <div className="sweetbox-header">
          <h1 className="sweetbox-title">🎁 Your Gift Box</h1>
          {boxToView.recipient && (
            <p className="sweetbox-tagline">a special gift for {boxToView.recipient}</p>
          )}
        </div>

        {/* Customization controls */}
        <div className="bouquet-controls">
          <button className="bouquet-control-btn" onClick={() => shuffleArrangement(viewExpandedItems.length)}>
            Shuffle Arrangement
          </button>
          <button className="bouquet-control-btn bouquet-control-outline" onClick={cycleGreenery}>
            Change Greenery
          </button>
        </div>

        {/* Gift display area — bouquet + sweets box side by side */}
        <div className={`gift-display-row ${animateIn ? "sweetbox-animate-in" : ""}`}>
          {/* Bouquet (flowers & hearts) */}
          {bouquetItems.length > 0 && (
            <div className="bouquet-wrapper bouquet-wrapper-visible" ref={boxRef}>
              <div className="bouquet-stage">
                <img
                  src={`/greenery/bush-${greenery + 1}.png`}
                  alt="greenery"
                  className="bouquet-bush-bottom"
                  draggable={false}
                />
                <div className="bouquet-items">
                  {bouquetItems.map((item, i) => {
                    const rotation = ((i * 7 + 3) % 11) - 5;
                    const order = itemOrder.length > 0 ? (itemOrder[i] ?? i) : i;
                    return (
                      <div
                        key={i}
                        className="bouquet-item bouquet-fade-in"
                        style={{
                          order,
                          animationDelay: `${i * 80}ms`,
                          transform: `rotate(${rotation}deg)`,
                        }}
                        title={`${item.name} — ${item.meaning}`}
                      >
                        <ItemVisual item={item} className="bouquet-item-visual" />
                      </div>
                    );
                  })}
                </div>
                <img
                  src={`/greenery/bush-${greenery + 1}-top.png`}
                  alt="greenery top"
                  className="bouquet-bush-top"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Sweets candy box */}
          {sweetBoxItems.length > 0 && (
            <div className="candy-box-wrapper">
              <div className="candy-box">
                {/* Lid */}
                <div className="candy-box-lid">
                  <div className="candy-box-lid-stripe"></div>
                  <div className="candy-box-bow">
                    <span className="candy-box-bow-loop candy-box-bow-left"></span>
                    <span className="candy-box-bow-knot"></span>
                    <span className="candy-box-bow-loop candy-box-bow-right"></span>
                  </div>
                </div>
                {/* Interior tray */}
                <div className="candy-box-tray">
                  <div className="candy-box-items">
                    {sweetBoxItems.map((item, i) => {
                      const rotation = ((i * 11 + 5) % 13) - 6;
                      return (
                        <div
                          key={i}
                          className="candy-box-item bouquet-fade-in"
                          style={{
                            animationDelay: `${i * 100}ms`,
                            transform: `rotate(${rotation}deg)`,
                          }}
                          title={`${item.name} — ${item.meaning}`}
                        >
                          <ItemVisual item={item} className="candy-box-item-visual" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback: if ALL items are sweets and no bouquet items, still show a simple layout */}
          {bouquetItems.length === 0 && sweetBoxItems.length === 0 && (
            <div className="bouquet-wrapper bouquet-wrapper-visible" ref={boxRef}>
              <div className="bouquet-stage">
                <img
                  src={`/greenery/bush-${greenery + 1}.png`}
                  alt="greenery"
                  className="bouquet-bush-bottom"
                  draggable={false}
                />
                <div className="bouquet-items">
                  {viewExpandedItems.map((item, i) => {
                    const rotation = ((i * 7 + 3) % 11) - 5;
                    const order = itemOrder.length > 0 ? (itemOrder[i] ?? i) : i;
                    return (
                      <div
                        key={i}
                        className="bouquet-item bouquet-fade-in"
                        style={{
                          order,
                          animationDelay: `${i * 80}ms`,
                          transform: `rotate(${rotation}deg)`,
                        }}
                        title={`${item.name} — ${item.meaning}`}
                      >
                        <ItemVisual item={item} className="bouquet-item-visual" />
                      </div>
                    );
                  })}
                </div>
                <img
                  src={`/greenery/bush-${greenery + 1}-top.png`}
                  alt="greenery top"
                  className="bouquet-bush-top"
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>

        {boxToView.note && (
          <div className="sweetbox-note-card">
            {boxToView.recipient && <p className="sweetbox-note-to">Dear {boxToView.recipient},</p>}
            <p className="sweetbox-note-text">{boxToView.note}</p>
            {boxToView.sender && <p className="sweetbox-note-from">With love, {boxToView.sender}</p>}
          </div>
        )}

        {!viewBox && !shareUrl && (
          <button className="sweetbox-share-btn" onClick={handleShare}>
            ✨ Save & Create Shareable Link
          </button>
        )}

        {shareUrl && (
          <div className="sweetbox-share-area">
            <p className="sweetbox-share-label">Share this link with someone special:</p>
            <div className="sweetbox-share-url-row">
              <input className="sweetbox-share-input" value={shareUrl} readOnly />
              <button className="sweetbox-copy-btn" onClick={handleCopy}>
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <div className="sweetbox-box-actions">
          <button
            className="sweetbox-back-btn"
            onClick={() => {
              if (viewBox) {
                setViewBox(null);
                setStage("gallery");
              } else {
                setStage("note");
              }
            }}
          >
            ← Back
          </button>
          <button className="sweetbox-gallery-btn" onClick={() => { setViewBox(null); setStage("gallery"); }}>
            📦 View Gallery
          </button>
          <button
            className="sweetbox-new-btn"
            onClick={() => {
              setItems([]);
              setNote("");
              setSender("");
              setRecipient("");
              setShareUrl("");
              setViewBox(null);
              setStage("pick");
            }}
          >
            + New Box
          </button>
        </div>
      </div>
    );
  }

  /* ─── Note Stage ─── */
  if (stage === "note") {
    return (
      <div className="sweetbox-container">
        <div className="sweetbox-header">
          <h1 className="sweetbox-title">🎁 Add a Note</h1>
          <p className="sweetbox-tagline">write a sweet message for your gift</p>
        </div>

        <div className="sweetbox-note-form">
          <div className="sweetbox-form-group">
            <label className="sweetbox-label">To</label>
            <input
              className="sweetbox-input"
              placeholder="Recipient's name"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="sweetbox-form-group">
            <label className="sweetbox-label">Your Message</label>
            <textarea
              className="sweetbox-textarea"
              placeholder="Write something sweet..."
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="sweetbox-form-group">
            <label className="sweetbox-label">From</label>
            <input
              className="sweetbox-input"
              placeholder="Your name"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
            />
          </div>
        </div>

        <div className="sweetbox-note-actions">
          <button className="sweetbox-back-btn" onClick={() => setStage("pick")}>
            ← Back
          </button>
          <button className="sweetbox-next-btn" onClick={() => setStage("box")}>
            See My Gift Box →
          </button>
        </div>
      </div>
    );
  }

  /* ─── Pick Stage ─── */
  return (
    <div className="sweetbox-container">
      <div className="sweetbox-header">
        <h1 className="sweetbox-title">🎁 SweetBox</h1>
        <p className="sweetbox-tagline">build a digital gift box of sweets, flowers &amp; love</p>
      </div>

      {/* Category tabs */}
      <div className="sweetbox-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`sweetbox-tab ${filter === cat.key ? "sweetbox-tab-active" : ""}`}
            onClick={() => setFilter(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="sweetbox-counter">
        <span>
          {total} / {MAX_ITEMS} items selected
        </span>
        {total > 0 && (
          <button className="sweetbox-gallery-btn" onClick={() => setStage("gallery")}>
            📦 Gallery
          </button>
        )}
      </div>

      {/* Picker grid */}
      <div className="sweetbox-picker">
        {filtered.map((item) => {
          const count = countMap[item.id] || 0;
          return (
            <div key={item.id} className={`sweetbox-picker-item ${count > 0 ? "sweetbox-picker-selected" : ""}`}>
              <button
                className="sweetbox-picker-btn"
                onClick={() => addItem(item)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeItem(item.id);
                }}
                title={`${item.name} — ${item.meaning}`}
              >
                <ItemVisual item={item} className="sweetbox-picker-emoji" />
                <span className="sweetbox-picker-name">{item.name}</span>
              </button>
              {count > 0 && (
                <span className="sweetbox-picker-badge">{count}</span>
              )}
              {count > 0 && (
                <button
                  className="sweetbox-picker-remove"
                  onClick={() => removeItem(item.id)}
                  title="Remove one"
                >
                  &minus;
                </button>
              )}
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <p className="sweetbox-hint">Tap to add, use &minus; to remove.</p>
      )}

      {/* Mini preview */}
      {total > 0 && (
        <div className="sweetbox-mini-preview">
          <p className="sweetbox-mini-label">Your box so far:</p>
          <div className="sweetbox-mini-items">
            {expandedItems.map((item, i) => (
              <span key={i} className="sweetbox-mini-emoji sweetbox-bounce-in" style={{ animationDelay: `${i * 50}ms` }}>
                <ItemVisual item={item} />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="sweetbox-pick-actions">
        {savedBoxes.length > 0 && (
          <button className="sweetbox-gallery-btn" onClick={() => setStage("gallery")}>
            📦 View Gallery ({savedBoxes.length})
          </button>
        )}
        {total >= 1 && (
          <button className="sweetbox-next-btn" onClick={() => setStage("note")}>
            Add a Note & Wrap It →
          </button>
        )}
      </div>

      {/* Inspect Modal */}
      {inspect && (
        <div className="sweetbox-modal-overlay" onClick={() => setInspect(null)}>
          <div className="sweetbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sweetbox-modal-close" onClick={() => setInspect(null)}>
              ✕
            </button>
            <ItemVisual item={inspect} className="sweetbox-modal-emoji" />
            <h2 className="sweetbox-modal-name">{inspect.name}</h2>
            <p className="sweetbox-modal-meaning">{inspect.meaning}</p>
            <p className="sweetbox-modal-flavor">Flavor: {inspect.flavor}</p>
            <div className="sweetbox-modal-actions">
              <button className="sweetbox-modal-add" onClick={() => { addItem(inspect); setInspect(null); }}>
                Add to Box
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
