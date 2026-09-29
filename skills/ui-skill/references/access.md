# Protected pages and paywalls

The server always decides access; the UI only reflects its answer.

## Sign-in and protected pages

- **Sign-in layout,** as the user chose: a centred card, or a split page with the form on one side and a brand panel on the other (the product name, one line of value, and a real screenshot or brand art, never stock or abstract filler).
- **Account menu:** in the container the user chose, at its conventional spot, built from that container's components and theme tokens. In a header, at the trailing end after the navigation, matching the header's other actions; in a sidebar, pinned to the bottom as a full-width row with avatar, name and a chevron; on mobile, inside the mobile menu or sheet. Signed out, the spot shows "Sign in" and no links to private pages; signed in, the menu holds profile, settings, the plan page if there is one, and sign-out.
- While the session loads, show a skeleton of the page, never a blank screen. Send signed-out users to sign in and back to where they were afterwards. Never render protected content and hide it afterwards.

## Paywalls

**Soft paywall** (a preview, like Medium):

- The server sends non-payers only the preview, never the full content hidden with CSS.
- Render the preview, then fade its last lines into the background with a gradient overlay.
- Below it, a centred `Card` (about `max-w-md`): a short heading ("Continue reading with Pro"), one line on what they get, the price, and one primary button. Signed-out users see "Sign in" as a secondary link.

**Hard paywall:** send non-payers to the plan page, and back to the content after they buy.

**Everywhere:**

- Owners never see a prompt.
- Show "Confirming your payment…" only while a payment is actually being confirmed.
