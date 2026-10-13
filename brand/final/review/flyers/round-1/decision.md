# Flyers, round 1: the decision

Read with `designer.md` and `marketing.md` in this folder. The two reviews agreed on Face B and split on Face A, so this is the merge, not either verdict.

## Face A, the poster

- **The stamp leads** (the designer; the brief's one flyer rule). 120 mm wide at A4, centred, with its clear space kept. It is the mat front at wall size, so the mat, the flyer and the site say the same thing in the same shape.
- **"spread out." is the instruction** (marketing, from Concept 3). It is the second thing you read from the door. Set tight like every other headline: the letter-spaced gag from Concept 3 is dropped, as the designer said it either breaks the tracking rule or isn't there.
- **The house line is the third read** (marketing, from Concept 2): "This bar does The Cluster. The bar staff know who’s next." It is why a landlord prints it, the permission a drinker needs to leave the line, and the reassurance in one line. The designer's alternative, the post office strap under the stamp, loses to it; "It’s a pub. Not a post office." is cut from the poster altogether (marketing: "if crowded, cut the strap first"; the designer: one idea).
- **One roundel per sheet, and a plain QR.** The roundel sits at the foot beside "Sign the petition." and the address. The tile in the QR is dropped (the designer: a mono laser plus a photocopy eats both the roundel and the error correction it costs). The code stays level H, the brief's and the task's rule, at 36 mm.
- **The bar motif and the four columns from Concept 3 are gone.** The bar was a redraw of the mark; the columns failed A5.

## Face B, the how-to

- Concept 1's skeleton: bare numerals, the four steps verbatim from the site, one heavy rule, the worked example under it, the stamp signing bottom right at 30 mm (21 mm at A5).
- **The campaign's voice, not "the rules of this bar"** (marketing: a pub doesn't want the jokes or the sum in its own mouth). The house line is folded into the kicker ("this bar does the cluster. here’s how.") so a sheet printed alone still carries the pub's permission.
- No rules between the steps and no box round the sum (the designer: too much linework); the "worked example" tag sits on the rule at the right, as the site does.
- The worked example gets its caveat in words, not just the tag: "Arithmetic, not a stopwatch. Real pubs are messier." (the second sentence is the site's own line).
- The scan reason is the test: "Think you’re ready? Take the test." Each face earns one scan.

## Both

- Nothing under 3.5 mm x-height on A4 (2.5 mm at A5): bodies and the address go up to about 6.2 to 6.5 mm type.
- The address is the fallback, not the route: 600 weight, two lines, broken after the first dot.
- The YouGov figures stay off both faces.
- The flyers point where the mats point: `https://dontqueueatthebar.co.uk/` (`SITE_URL` in `scripts/lib/site.mjs`, shared by both scripts). Round 2 was first rendered with the live workers.dev address and re-rendered with the real domain when the user asked for it; the domain must be pointed at the site before a flyer is printed.
