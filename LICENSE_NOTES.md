# LICENSE_NOTES.md

You didn't ask about this, but it matters for your business site — flagging it now rather
than after launch.

## The situation
ryOS is licensed AGPL-3.0. Unlike MIT/Apache (which ryOS's original author could have chosen),
AGPL has a "network use" clause: if you run a *modified* version of the code as a service that
other people interact with over a network — which a public website is — you're required to
make your modified source code available to the people using it. This applies even though
you're not distributing a binary or app; visiting the site counts as "use."

## What this means for ohmxo.com running a modified ryOS
- You'd need to make your source (including your custom apps, branding, and any modifications)
  available to visitors — typically via a visible link to a public repo.
- This is separate from, and in addition to, giving credit/attribution.
- It does not stop you from using the code commercially — AGPL permits commercial use — it
  only requires source disclosure for your modified version.

## Your realistic options
1. **Comply**: keep your fork in a public (or accessible-on-request) repo and link it from the
   site footer. Simplest path, no legal risk, costs you nothing except visibility into your
   code (which for a portfolio/marketing site is usually a non-issue).
2. **Rewrite from scratch**: build your own desktop-OS shell inspired by ryOS's ideas but not
   derived from its code — avoids AGPL obligations entirely, but is significantly more work and
   defeats the "fork and customize" plan.
3. **Contact the original author** for a separate license if you specifically don't want to
   publish source — unlikely to be worth pursuing for a personal/portfolio site.

For a personal portfolio/marketing site, option 1 is almost certainly the practical choice —
just don't quietly keep the fork private while running it publicly.

This isn't legal advice — if you want certainty, a quick check with an actual lawyer familiar
with open-source licensing is the safe move before launch.
