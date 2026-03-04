SweetBox
A client-side Next.js application for building shareable digital gift boxes. Users compose a curated arrangement of sweets, flowers, and hearts, attach a handwritten note, and generate a self-contained shareable URL. No backend services, no database, no authentication.

Tech Stack
Layer	Technology
Framework	Next.js 16.1.6 (App Router)
Runtime	React 19, TypeScript 5.8 (strict)
Styling	Tailwind CSS 4 + CSS custom props
State	React hooks (no external store)
Persistence	localStorage (JSON, max 50 boxes)
Sharing	base64-encoded URL query param
The entire application is statically rendered at build time. The single interactive component (SweetsBuilder) is a client component that manages all state in-memory with React hooks. Persistence is limited to localStorage for saved boxes.

Directory Structure
sweet/
  app/
    layout.tsx              Root HTML shell, global metadata, imports globals.css
    page.tsx                Landing page (/) -- server component
    globals.css             All styles (~1230 lines), CSS custom properties
    sweets/
      layout.tsx            Scroll wrapper for the /sweets route
      page.tsx              Renders <SweetsBuilder /> -- server component with OG metadata

  components/
    sweets/
      SweetsBuilder.tsx     Single client component (~630 lines) -- all interactive logic
      sweetsData.ts         Item catalog: types, 51 items across 3 categories
    gallery/
      projects.ts           Stub file, currently unused

  public/
    items/                  Item PNG assets (flowers, sweets). Served at /items/*.png
    greenery/               Bouquet background layers -- 3 variants, 2 layers each
No API routes, no middleware, no server actions. The only server-rendered files are the two page components, which contain nothing beyond metadata and a component import.

Routing
Route	Component	Rendering
/	Landing hero	Static
/sweets	SweetsBuilder	Static/CSR
/sweets?box={base64}	Shared box view	Static/CSR
The ?box query parameter encodes an entire GiftBox payload. On mount, the component decodes it and enters read-only view mode. This means shared links are fully self-contained -- no server lookup required.

Core Component: SweetsBuilder
Stage Machine
The component is driven by a stage state variable with four values:

pick  --->  note  --->  box
                         |
                     gallery  <---  box (back)
pick -- Item selection grid. Filterable by category (all / sweets / flowers / hearts). Tap to add, minus button to remove. Max 18 items. Badge shows per-item count. Mini preview strip at the bottom.

note -- Optional form: recipient name, message body, sender name.

box -- Final visual display. Items are split by category at render time:

bouquetItems (flowers + hearts) render in a layered bouquet with greenery overlays, overlapping layout, and per-item rotation.
sweetBoxItems (sweets) render in a separate candy box with a lid, ribbon, and bow, positioned beside the bouquet. Both containers sit in a flex row that breaks out of the 640px container (up to 960px) to accommodate side-by-side layout. Stacks vertically below 700px.
gallery -- Grid of saved boxes from localStorage. Click to re-open.

Key State
stage: "pick" | "note" | "box" | "gallery"
items: BoxItem[]           // [{itemId, count}] -- the user's selection
filter: Category | "all"   // active category tab
viewBox: GiftBox | null    // non-null when viewing a shared/saved box
animateIn: boolean         // triggers entrance animation on box stage
greenery: number           // 0-2, indexes the greenery variant
itemOrder: number[]        // Fisher-Yates shuffled indices for bouquet
All state is local to the component. No context providers, no reducers, no external state library.

Sub-component: ItemVisual
Renders an <img> when item.image is set, with an onError fallback to the emoji. This means every image-based item degrades gracefully if the PNG is missing or fails to load.

Data Model
SweetItem (catalog)
type Category = "sweets" | "flowers" | "hearts";

interface SweetItem {
  id: number;
  name: string;
  emoji: string;        // always present, used as fallback
  image?: string;       // path under /public, e.g. "/items/rose.png"
  flavor: string;
  meaning: string;
  color: string;
  category: Category;
}
51 items total: 17 sweets, 22 flowers, 12 hearts. Defined as a flat array in sweetsData.ts. IDs are not sequential (legacy -- some ranges were added in batches: 1-12, 13-24, 25-36, 37-51).

BoxItem (user selection)
interface BoxItem {
  itemId: number;  // references SweetItem.id
  count: number;   // 1..n of this item in the box
}
GiftBox (shareable payload)
interface GiftBox {
  items: BoxItem[];
  note: string;
  sender: string;
  recipient: string;
  createdAt: string;  // ISO 8601
}
Serialized with btoa(JSON.stringify(box)) for URL sharing. Deserialized with JSON.parse(atob(encoded)) on mount.

The encoding is intentionally simple. There is no compression, no signature, no versioning. Payloads are small enough that URL length limits are not a practical concern for the expected item count.

Rendering Pipeline: Box View
Item Splitting
viewExpandedItems  -->  filter by category
  |
  +--  flowers + hearts  -->  bouquetItems  -->  bouquet with greenery
  |
  +--  sweets            -->  sweetBoxItems -->  candy box
Both arrays are derived at render time (no memoization -- item count is capped at 18 so this is negligible).

Bouquet Layering
z:  0   bush-{n}.png           Bottom greenery (absolute, centered)
z:  5   .bouquet-items          Flex wrap-reverse, negative margins for overlap
z: 10   bush-{n}-top.png        Top greenery (covers lower portions of items)
z: 20   hovered item            Elevated on :hover
Each item gets a deterministic pseudo-random rotation: ((i * 7 + 3) % 11) - 5 degrees, applied as inline transform.

The bouquet-fade-in animation uses the scale CSS property (not transform) specifically to avoid overriding the inline rotation. This was a deliberate fix -- the original sweetbox-pop-in animation used transform: rotate(0deg) in its final keyframe, which wiped out per-item rotations.

Candy Box
Structured as:

Lid -- rose/mauve gradient with a horizontal ribbon stripe and a CSS-only bow (two oval pseudo-loops and a round knot).
Tray -- pink interior with inset shadows and a dashed paper-liner border. Items scatter with negative margins and per-item rotation.
The gift display row uses margin-left: 50%; transform: translateX(-50%) to break out of the parent container width while remaining centered.

Styling
All styles live in app/globals.css. No CSS modules, no CSS-in-JS.

Design Tokens
CSS custom properties on :root:

--sweet-pink, --sweet-peach, --sweet-lavender, --sweet-mint, --sweet-cream
--sweet-rose, --sweet-gold, --sweet-white
--sweet-text, --sweet-text-light, --sweet-border, --sweet-shadow
--sweet-gradient, --sweet-gradient-alt
Class Naming Conventions
Prefix	Scope
.sweetbox-*	Builder component
.bouquet-*	Bouquet display
.candy-box-*	Sweets container
.home-*	Landing page
Responsive Breakpoints
Breakpoint	Behavior
<= 480px	3-col picker grid, smaller bouquet, smaller emojis
<= 700px	Gift display row stacks vertically
481-768px	4-col picker grid
Animations
Name	Duration	Purpose
bouquet-fade-in	0.5s	Items scale in (staggered per-item)
sweetbox-bounce-in	0.4s	Mini preview items
sweetbox-badge-pop	0.3s	Badge/remove button pop
home-orbit	12s	Emoji ring on landing page
home-shimmer	3s	Gradient sweep on title text
Item entrance is staggered via inline animation-delay computed from the item index (80ms per bouquet item, 100ms per candy box item, 50ms per mini preview item).

Asset Pipeline
/public/items/
PNG images for items with the image field set in sweetsData.ts.

To add a new image-based item:

Drop the PNG into /public/items/
Add an entry to sweetsData with image: "/items/filename.png"
ItemVisual handles rendering and fallback automatically
Images are served statically by Next.js. No image optimization pipeline is configured (no next/image usage) -- items are small enough that raw PNGs are acceptable.

/public/greenery/
Three greenery variants for the bouquet background:

bush-1.png + bush-1-top.png
bush-2.png + bush-2-top.png
bush-3.png + bush-3-top.png
The top layers for variants 2 and 3 are intentionally 1x1 transparent PNGs. This is by design, not a missing asset.

Persistence
localStorage
Key: "sweetboxes"

[
  {
    "id": "a1b2c3d4",
    "box": {
      "items": [{"itemId": 13, "count": 2}],
      "note": "Happy birthday!",
      "sender": "Alice",
      "recipient": "Bob",
      "createdAt": "2026-02-14T00:00:00.000Z"
    }
  }
]
Max 50 entries, oldest pruned on save.
IDs are random 8-character base-36 strings.
No migration strategy. Schema changes will silently break old entries.
No cross-device sync. Boxes exist only in the browser that created them.
URL Sharing
Shared boxes encode the full GiftBox object as base64 in a query parameter: /sweets?box={base64}. The recipient's browser decodes and renders the box without any server request.

Development
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
TypeScript is in strict mode. The project uses path aliases (@/* maps to the project root).

Known Quirks
bouqet.png is intentionally misspelled (legacy asset name, referenced in sweetsData as-is).
components/gallery/projects.ts exists but is not imported anywhere.
sweetbox-pop-in is defined in CSS but unused (replaced by bouquet-fade-in). Kept to avoid breaking any cached shared boxes that might reference it.
Item IDs have gaps (1-12, 13-24, 25-36, 37-51) due to batch additions. The lookup is a linear scan via Array.find -- acceptable at 51 items.
