/* The candidate, from the campaign's own sitting, sized for the web by
   scripts/build-photos.mjs. All three are the same white agbada and fila
   against the same pale wall, so any two of them sit together as a pair.
   Named for what is in the frame, so a slot can be chosen by reading the
   name rather than by opening the file. */
import adebayoPointing from "./photos/adebayo-pointing.webp";
import adebayoSpeaking from "./photos/adebayo-speaking.webp";
import adebayoResolve from "./photos/adebayo-resolve.webp";

/* The country the eight pillars are about, one photograph per subject. These
   are for page headers and pillar cards, under a scrim — none of them shows
   the candidate or the movement, and none is captioned as if it did. */
import ngAsoRock from "./photos/ng-aso-rock.webp";
import ngAssembly from "./photos/ng-assembly.webp";
import ngBeach from "./photos/ng-beach.webp";
import ngBridgeNight from "./photos/ng-bridge-night.webp";
import ngFarmer from "./photos/ng-farmer.webp";
import ngLagos from "./photos/ng-lagos.webp";
import ngLekki from "./photos/ng-lekki.webp";
import ngMarket from "./photos/ng-market.webp";
import ngNurse from "./photos/ng-nurse.webp";
import ngPolice from "./photos/ng-police.webp";
import ngPupils from "./photos/ng-pupils.webp";
import ngRail from "./photos/ng-rail.webp";
import ngRice from "./photos/ng-rice.webp";
import ngUnilag from "./photos/ng-unilag.webp";

/* The Amvora identity, derived from the supplied master by
   scripts/build-brand-assets.mjs. The master ships on a white satin disc,
   which renders as a plate behind the mark on any surface that is not white —
   see that script for the crop and the de-whiting.

   amvoraMark       the torch-and-figures symbol alone, for the masthead and
                    other light surfaces where the name is set in type beside it.
   amvoraMarkLight  the same symbol with its black turned white, for the
                    ink-950 footer and any dark band. The flame keeps its colour.
   amvoraLogo       the full lockup including "AMVORALIGHT / POWER IS IN THE
                    STREETS". The type is black, so light surfaces only.

   There is no SDP party mark here: none was supplied, and a redrawn or
   scraped party logo on a campaign site is not something to guess at. The
   party is named in type wherever its mark would go. */
import amvoraMark from "./amvora-mark.png";
import amvoraMarkLight from "./amvora-mark-light.png";
import amvoraLogo from "./amvora-logo.png";

export const assets = {
  adebayoPointing,
  adebayoSpeaking,
  adebayoResolve,
  ngAsoRock,
  ngAssembly,
  ngBeach,
  ngBridgeNight,
  ngFarmer,
  ngLagos,
  ngLekki,
  ngMarket,
  ngNurse,
  ngPolice,
  ngPupils,
  ngRail,
  ngRice,
  ngUnilag,
  amvoraMark,
  amvoraMarkLight,
  amvoraLogo,
};
