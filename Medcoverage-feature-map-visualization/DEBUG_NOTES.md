# MedCoverage feature/map-visualisation — Debug Notes

Fixed in this version:
- Preset scenario values were inconsistent with the dynamic simulation formula; preset population/coverage/response results were corrected.
- Selecting an intervention from the coverage map now computes and carries the actual simulation result into the What-If page instead of falling back to a hard-coded 72% result.
- The What-If simulator now preserves the selected map intervention (zone, action, resource type, quantity) when navigating between pages.
- Custom simulations now create markers matching the selected resource type instead of reusing a stale preset marker.
- Manual changes to action/resource/zone/quantity clear the preset selection so the UI cannot display a stale preset as active.

Validation:
- Relative source imports were checked and no missing local imports were found.
- A production build could not be executed in this environment because the npm registry package tarballs were unavailable; the supplied node_modules directory was incomplete. Run `npm install` followed by `npm run build` locally to perform the final Vite build check.
