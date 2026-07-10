/**
 * website-builder-guided-tour.js
 * Guided tour for the abcjs-eskin Website Builder.
 *
 * MIT License
 * Copyright (c) 2026 Michael Eskin
 */
(function () {
  "use strict";

  var api = null;
  var tourRunning = false;
  var overlay = null;
  var card = null;
  var arrowLayer = null;
  var highlightedElement = null;
  var activeLayoutHandler = null;
  var activeLayoutFrame = 0;

  var EXAMPLE_PROJECT = {"projectFormat":"abcjs-eskin-website-builder-project","version":"1.2.24","savedAt":"2026-07-10T12:00:00.000Z","projectFilename":"comhaltas-san-diego-guided-tour-project.txt","settings":{"title":"Example Session Tunebook","subtitle":"Twenty Traditional Irish Session Tunes","footer":"Created with the abcjs-eskin Website Builder","includeTuneHeading":false,"includeCollectionIntro":false,"collectionIntro":"","theme":"irish","displayMode":"notation","instrumentSelector":"show","showStringInstrumentTablatureNames":"hide","cursorColor":"green","cursorAutoscrollGuardBand":"large","showTuneDividers":"show","titleAndTableOfContentsLabelFontSize":"medium","includeTableOfContents":"showSearch","tableOfContentsMaxColumns":"4","tableOfContentsGapSize":"medium","injectSoundSettings":true,"soundfont":"fatboy","melodyProgram":"0","bassProgram":"0","bassVolume":"64","chordProgram":"0","chordVolume":"64","playerPosition":"below","notationWidth":"100","bodyWidth":"1180","tuneNumbers":"show","includeSectionHeaderNumbers":"hide","abcToolsLinks":"player","tuneDisplay":"multiple","tableOfContentsBottomButtons":"disabled","backToTuneTopBottomButton":"disabled","titleArticleReverser":"postfixToPrefix","largeCollectionGrouping":"disabled","tuneOrder":"preserve","largeCollectionGroupingBatchSize":"100","printTitlePageAndTextBeforeTunes":"titleOnly","deploymentTarget":"standalone"},"files":[{"name":"comhaltas-san-diego-tune-learning-tunebook.abc","size":9855,"count":20}],"records":[{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Banshee\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:G\n%swing 0.1\n|: \"G\" G2 GD EDB,D | GFGB d2 Bd | \"C\" eged \"G\" BAGA | \"Am\" BAGE \"D\" EDDE |\n\"G\" G2 GD EDB,D | GFGB d2 Bd | \"C\" eged \"G\" BAGA | \"Am\" BAGE \"D\" ED D2 :|\n|:\"Am\" eaag efge | \"Em\" dBBA B3 d | \"Am\" eBBB gBfB | \"G\" eBBA B3 d |\n\"Am\" eaag efge | \"Em\" dBBA B3 d | \"C\" eged \"G\" BAGA | \"Am\" BAGE \"D\" ED D2 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Beeswing\nR:Hornpipe\nL:1/8\nM:4/4\nQ:2/4=72\nK:G\n|: (3DEF | \"G\" GdBG \"D\" FcAF | \"G\" DBGD B,GDB, | \"C\" CEAc \"G\" B,DGB |\"Am\" (3ABA (3GFE \"D\" D2 (3DEF | \n\"G\"GdBG \"D\" FcAF | \"G\" DBGD B,GDB, | \"C\"CEAc \"G\"BAGF |\"D\" (3ABA GF \"G\" G2 :|\n|: dc |\"G\" (3BAG dB gdBG | \"D\" (3AGF dA fdAF |\"C\" ECGE cABG | \"Am\" (3ABA (3GFE \"D\" D2 (3DEF |\n\"G\" GdBG \"D\" FcAF | \"G\" DBGD B,GDB, | \"C\"CEAc \"G\" BAGF | \"D\" (3ABA GF \"G\"G2 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:Cooley's\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:D\n%swing 0.1\n|: \"Em\" EBBA B2 EB | B2 AB dBAG | \"D\" (3FED AD BDAG | FDFA BAGF |\n\"Em\" EBBA B2 EB | B2 AB defg | \"D\"afge dBAF |1 \"Bm\" DEFD \"Em\" E3 D :|2\"Bm\" DEFD \"Em\" E2 gf ||\n|: \"Em\" eBBB eBgf | eBBB gedB | \"D\" A2 FA DAFA |BAFA defg |\n\"Em\" eBBB eBgf | eBBB defg | \"D\" afge dBAF |1 \"Bm\" DEFD \"Em\" E2 gf :|2 \"Bm\" DEFD \"Em\" E4 |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:Father Kelly's\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:G\n%swing 0.1\n|: \"G\" B2 GB AGEG | DGGF G2 AB | \"Am\" cBAB cBAG | \"C\" EAAG \"D\" FDGA |\n\"G\" B2 GB AGEG | DGGF GABc | d2 Bd \"C\" gdBd |1 \"D\" cAFA \"G\" G2 GA :|2 \"D\" cAFA \"G\" G2 Bc ||\n|: \"G\" d2 Bd gdBc | d2 Bd gdBd | \"C\" e2 ce agfe |\"D\" defg agfe |\n\"G\"d2 Bd gdBc | d2 Bd gdBd | \"Am\" cBAc \"G\" BAGB |1 \"D\" AGEF \"G\" G2 Bc :|2 \"D\" AGEF \"G\"G2 GA |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Flowing Tide\nR:Hornpipe \nL:1/8\nM:4/4\n%swing\nQ:2/4=72\nK:G\nD2 |: \"G\" G2 GB dGBd | GBdg bgag | \"C\"(3efg dg \"G\" Bdge |\"C\"dBAG \"D\"edBA |\n\"G\" G2 GB dGBd | GBdg bgag | \"C\" (3efg dg \"G\"Bdge |\"D\" dBAB \"G\" G3 D :|\n|: \"Em\" GFGB AGED | \"G\" gfge dBGB | \"Am\" ceBd \"G\" ABGB |\"C\" (3cBA BG \"D\"AGEG |\n\"G\"DGBd B2 Bd | \"C\" (3cBA BG \"G\" AGEG | \"C\" DGBd \"G\" gdBG |\"D\" DGFA \"G\"G4 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Kesh\nR:Jig\n%swing 0.1\nL:1/8\nM:6/8\nQ:3/8=110\nK:G\n|: D | \"G\" GAG GAB | \"D\" ABA ABd |\"C\" edd gdd | edB \"D\" dBA |\n\"G\" GAG GAB | \"D\" ABA ABd |\"C\" edd \"G\" gdB | \"D\" ABA \"G\" G2 :|\n|: A |\"G\" BAB dBd |\"C\" ege dBA | \"G\" BAB dBG | \"D\" ABA AGA |\n\"G\" BAB dBd |\"C\" ege dBd | \"G\" gfg \"D\" aga | \"G\" bgf g2 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:King of the Fairies \nL:1/8\nM:4/4\nR:Hornpipe\nQ:2/4=72\nK:G\n|: B,2 | \"Em\" E^DEF GFGA | BcBA GFGA | B2 E2 EFGE |\"D\" FGFE \"Bm\" D2 B,2 |\n\"Em\" E^DEF \"D\" GFGA | \"G\"BAGB d3 c | \"Em\" B2 E2 \"D\" GFED | \"Em\" E2 ED E2 :|\n(3B^cd |\"Em\" e2 B2 Bdef | gagf e2 ef |e2 B2 BAB^c | \"D\" ded^c \"Bm\" Bc (3dcB |\n\"Em\" e2 B2 Bdef | gagf efed |Bd (3efg \"D\" fe (3def | \"Em\" e2 ed e2 ef ||\n\"G\"g3 e \"D\" f3 d | \"Em\" edB^c \"D\" d2 de |dBAF \"G\" GAB^c | \"D\" dBAF GFED |\n\"Em\" B,2 E2 EFGA | B2 e2 edef | e2 B2 \"D\" BAGF | \"Em\" E2 ED E2 |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Lady on the Island\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:D\n%swing 0.1\n\"Bm\" BAFB AFEF | \"D\" D2 FA BAdB | \"Bm\" BAFB ADFA | \"D\" defd efdB |\n\"Bm\" BAFB AFEF | \"D\" D2 FA BAdB | \"Bm\" BAFB ADFA | \"D\" defd efdB ||\n\"D\" defd \"G\" efge | \"D\" afdf \"A\"edBA | \"D\" defd \"G\" efge | \"D\" afdf \"A\"e2 dB |\n\"D\" defd \"G\" efge | \"D\" afdf \"A\" edBA | \"G\" defg afbf | afeg fedB |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Maid Behind the Bar\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:D\n%swing 0.1\n|: \"D\" FAAB AFED | FAAB ABde | \"Bm\" fBBA Bcde | \"G\" f2 af \"A\"edBA |\n\"D\" FAAB AFED | FAAB ABde | \"Bm\" fBBA BcdB | \"A\" AFEF \"D\" D4 :|\n|:\"D\" faab afde | (3fed ad bdaf | \"Em\" efga beef | (3gfe be gfeg |\n\"D\" fgaf bfaf | defd efde | \"Bm\" fBBA BcdB | \"A\" AFEF \"D\" D4 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Merry Blacksmith\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:D\n%swing 0.1\n|: \"D\" d2 dA BAFA | ABdA BAFA | ABde fded | \"G\" Beed \"A\"egfe |\n\"D\" d2 dA BAFA | ABdA BAFA | ABde \"G\"fdec |1 \"A\" dBAF \"D\" D2 A2 :|2 \"A\" dBAF \"D\" D2 fg ||\n|: \"D\" a2 ag f2 fe | d2 dA BAFA | ABde fded |\"G\" Beed \"A\" egfe | \n\"D\"a2 ag f2 fe | d2 dA BAFA | ABde \"G\"fdec |1 \"A\" dBAF \"D\" D2 fg :|2 \"A\" dBAF \"D\" D4 |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:Morrison's\nR:Jig\nM:6/8\nL:1/8\nQ:3/8=110\n%swing 0.1\nK:Edor\n|:\"Em\"E2 E B2B|EBE \"D\"AFD|\"Em\"E2E B2c|\"D\"dcB AFD|\n\"Em\"E2 E B2B|EBE \"D\"AFD|\"G\"G2G FGA|\"D\"BAG FED:|\n\"Em\"Bee fee|aee \"D\"fed|\"Em\"Bee fef|\"D\"gag fed|\n\"Em\"Bee fee|aee \"D\"fef|\"G\"gfe d2A|\"D\"BAG FED|\n\"Em\"Bee fee|aee \"D\"fed|\"Em\"Bee fef|\"D\"faf def|\n\"G\"g2g gfe|\"D\"def \"G\"g2d|\"D\"edc d2A|BAG FED|]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:My Darling Asleep\nR:Jig\n%swing 0.1\nL:1/8\nM:6/8\nQ: 3/8=110\nK:D\ne |: \"D\" fdd \"A\" cAA | \"G\" BGB \"D\" A2 G | FAA def |\"G\" gfg \"A\" eag | \n\"D\" fdd \"A\" cAA | \"G\" BGB \"D\" A2 G | FAA \"G\" def |1 \"A\" gec \"D\" d2 e :|2 \"A\" gec \"D\" d2 A||\n|: \"D\" FAA BAG |FAA BAG | FAA def | \"G\" gfg \"A\"eag |\n\"D\" fdd \"A\" cAA | \"G\" BGB \"D\" A2 G | FAA \"G\" def |1 \"A\" gec \"D\" d2 A:|2 \"A\" gec \"D\" d3|]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X: 1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT: Out On The Ocean\nR: Jig\n%swing 0.1\nM: 6/8\nQ:3/8=110\nL: 1/8\nK: Gmaj\n|:\"G\" D2B BAG|BdB A2B|GED G2A|B2B \"C\" AGE|\n\"G\" D2B BAG|BdB A2B|GED G2A|1 \"D\" BGF \"G\" GFE:|2 \"D\" BGF \"G\" GBd||\n\"Em\" e2e edB|ege edB|\"D\" d2d def|gfe dBA|\n\"G\" G2A B2d|\"C\" ege \"D\" dBA|\"G\" GED G2A|1 \"D\" BGF \"G\" GBd:|2 \"D\" BGF \"G\" GFE|]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Rose in the Heather\nR:Jig\n%swing 0.1\nL:1/8\nM:6/8\nQ:3/8=110\nK:D\nA |: \"D\" FGF EFE | DFA BAF | ABd \"G\" ede |\"D\" fdB AFE |\n\"D\" FGF EFE | DFA BAF | AdB \"G\" AFE |1 \"A\" FDD \"D\" D2 E :|2 \"A\" FDD \"D\" D2 e ||\n|: \"D\" fdB ABd | faa afd | \"G\" gbg \"D\" fed | \"A\" Bee efg | \n\"D\" fdB ABd | faa afa | \"G\"baf gfe |1 \"A\" fdc \"D\" d2 e :|2 \"A\" fdc \"D\" d3 |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:Swinging on a Gate\nR:Reel \nL:1/8\nM:4/4\nQ:2/4=90\nK:G\n%swing 0.1\n|: \"G\" gedB G2 AB | \"C\" cABG \"D\" AGEG | \"G\" DGBd g2 g2 | \"Am\" fgag \"D\" fdef |\n\"G\" gedB G2 AB | \"C\"cABG \"G\"AGEG | \"C\"cABG \"G\"AGEG | \"D\" DGGF \"G\" G2 d2 :|\n|:\"G\" gfga bagf | gfed B2 AG | \"C\" EAAB cBAG | EAAB \"D\" cdef |\n\"G\" gfga bagf | gfed B2 AB | \"C\" cABG \"G\"AGEG | \"D\" DGGF \"G\" G4 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X: 1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT: Tobin's Favourite\nR:Jig\n%swing 0.1\nM: 6/8\nL: 1/8\nQ:3/8=110\nK: Dmaj\n|:\"D \" DFA ~d3|\"A\" ecA cde|\"D\" ~f3 \"G\" ~g3|\"A\" ecA GFE|\n\"D \" DFA ~d3|\"A\" ecA cde|\"D\" f3 \"G\" gec| \"A\" edc \"D\" d3:|\n|:\"D\" dfa agf|\"A\" efg efg|\"D\" fef \"G\" ~g3|\"A\" ecA GFE|\n\"D \" DFA ~d3|\"A\" ecA cde|\"D\" f/g/af \"G\" gec| \"A\" edc \"D\" d3:|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:The Torn Jacket\nR:Reel \nL:1/8\nM:4/4\nQ: 2/4=90\nK:D\n%swing 0.1\n|: \"D\" F3 A d2 ed | \"A\" cAAB cdeA | \"D\" FEFA d2 ed | \"A\" cAGE \"D\" ED D2 |\n\"D\" F3 A d2 ed | \"A\"cAAB cdec | \"D\" dcde f2 ed | \"A\"cAGE \"D\" ED D2 :|\n|:\"D\" FAdf a2 af | \"G\" g2 gf gfed | \"A\" cAAB cdef | gfed cAGE |\n\"D\" FAdf a2 af | \"G\" g2 gf gfef | gaba gfed | \"A\" cAGE \"D\" ED D2 :|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X:1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT:Tripping Up the Stairs\nR:Jig\n%swing 0.1\nL:1/8\nM:6/8\nQ: 3/8=110\nK:D\n|: \"D\" FAA \"G\" GBB | \"D\" FAd fed | \"A\" cBc ABc | \"D\" dfe \"G\" dAG |\n\"D\" FAA \"G\" GBB | \"D\" FAd fed | \"A\" cBc ABc |1 \"D\" dfe d2 A :|2 \"D\" dfe d2 c ||\n|: \"Bm\" dBB fBB | dBd fed | \"A\" cAA eAA | efe edc |\n\"Bm\" dBB fBB | dBd fed | \"A\" cBc ABc |1 \"D\" dfe d2 c :|2 \"D\" dfe d3 |]\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X: 1\nT: Willie Coleman's\nR: jig\nM: 6/8\nL: 1/8\nK: Gmaj\n\"G\" ~B3 AGE|GED GBd|edB dgb|age \"D\" dBA|\n\"G\" BAG AGE|GED GBd|\"C\" edB \"D\" dBA|\"G\" BGG G3:|\n\"G\" ~g3 edB|dgb age|~g3 edB|GBd \"C\" e2d|\n\"G\" gfg edB|dgb age|~d3 gdB|\"D\" AGE \"G\" G3:|\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"},{"abc":"X: 1\n%%titlefont Palatino 18\n%%subtitlefont Palatino 13\n%%infofont Palatino 13\n%%partsfont Palatino 13\n%%tempofont Palatino 13\n%%textfont Palatino 13\nT: The Wind That Shakes The Barley\nR:Reel\n%swing 0.1\nQ:2/4=90\nM: 4/4\nL: 1/8\nK: Dmaj\n%swing 0.1\n\"D\" A2AB AFED|\"G\" B2BA BcdB|\"D\" A2AB AFED|\"G\" gfed \"A\" BcdB|\n\"D\" A2AB AFED|\"G\" B2BA BcdB|\"D\" A2AB AFED|\"G\" gfed \"A\" Bcde||\n\"D\" f2fd \"G\" g2ge|\"D\" f2fd \"Bm\" Bcde|\"D\" f2fd \"G\" g2fg|\"D\" afed \"A\" Bcde|\n\"D\" f2fd \"G\" g2ge|\"D\" f2fd \"Bm\" Bcde|\"G\" defg afbf|afed \"A\" BcdB||\n","fileHeader":"","sourceName":"comhaltas-san-diego-tune-learning-tunebook.abc"}]};

  function waitMs(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }


  function waitForPreviewReturn() {
    return new Promise(function (resolve) {
      var finished = false;
      var leftBuilder = document.hidden || !document.hasFocus();
      var backgroundCheck = null;
      var safetyTimer = null;

      function cleanup() {
        window.removeEventListener("blur", onBlur);
        window.removeEventListener("focus", onFocus);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (backgroundCheck) clearTimeout(backgroundCheck);
        if (safetyTimer) clearTimeout(safetyTimer);
      }

      function finish() {
        if (finished) return;
        finished = true;
        cleanup();
        resolve();
      }

      function onBlur() {
        leftBuilder = true;
      }

      function onFocus() {
        if (leftBuilder) setTimeout(finish, 100);
      }

      function onVisibilityChange() {
        if (document.hidden) {
          leftBuilder = true;
        }
        else if (leftBuilder) {
          setTimeout(finish, 100);
        }
      }

      window.addEventListener("blur", onBlur);
      window.addEventListener("focus", onFocus);
      document.addEventListener("visibilitychange", onVisibilityChange);

      backgroundCheck = setTimeout(function () {
        if (!leftBuilder && !document.hidden && document.hasFocus()) finish();
      }, 1200);

      safetyTimer = setTimeout(finish, 300000);
    });
  }

  function injectStyles() {
    if (document.getElementById("website-builder-guided-tour-styles")) return;

    var style = document.createElement("style");
    style.id = "website-builder-guided-tour-styles";
    style.textContent = `
      .website-builder-tour-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.18);
        z-index: 2500;
        pointer-events: auto;
      }

      .website-builder-tour-card {
        position: fixed;
        z-index: 2147483646;
        width: min(460px, calc(100vw - 24px));
        max-width: calc(100vw - 24px);
        max-height: calc(100vh - 24px);
        overflow-y: auto;
        overscroll-behavior: contain;
        background: #f5ffff;
        border: 1px solid #bfcfcf;
        border-radius: 5px;
        box-shadow: 0 10px 26px rgba(0,0,0,.25);
        padding: 24px;
        box-sizing: border-box;
        font-family: helvetica, arial, sans-serif;
      }

      .website-builder-tour-card h2 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1.45em;
        line-height: normal;
        text-align: left;
        color: #000 !important;
      }

      .website-builder-tour-card p {
        margin: 0 0 10px 0;
        color: #000 !important;
        font-size: 12pt;
        line-height: 18pt;
      }

      .website-builder-tour-footer {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid #d8e3e3;
      }

      .website-builder-tour-count {
        text-align: center;
        font-size: 0.95em;
        color: #333;
        margin-bottom: 12px;
      }

      .website-builder-tour-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .website-builder-tour-buttons button {
        min-width: 96px;
        padding: 7px 16px;
        border: 1px solid #aaa;
        border-radius: 6px;
        background: #e5e5e5;
        color: #000;
        font-size: 11pt;
        font-family: helvetica, arial, sans-serif;
        cursor: pointer;
      }

      .website-builder-tour-buttons button:hover,
      .website-builder-tour-buttons button:focus-visible {
        background: #d5d5d5;
        outline: none;
      }

      .website-builder-tour-arrow-layer {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483645;
        pointer-events: none;
        overflow: visible;
      }

      .website-builder-tour-arrow-path {
        stroke: #d32f2f;
        stroke-width: 3;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,.2));
      }

      .website-builder-tour-highlight {
        position: relative;
        z-index: 2147483644 !important;
        box-shadow: 0 0 0 4px rgba(0, 90, 173, 0.30), 0 0 0 9999px rgba(255,255,255,0.06) !important;
        border-radius: 8px;
      }

      @media (max-height: 720px) {
        .website-builder-tour-card {
          padding: 18px 20px;
        }
        .website-builder-tour-card h2 {
          margin-bottom: 8px;
          font-size: 1.3em;
        }
        .website-builder-tour-card p {
          margin-bottom: 8px;
          font-size: 11pt;
          line-height: 16pt;
        }
        .website-builder-tour-footer {
          margin-top: 10px;
          padding-top: 9px;
        }
        .website-builder-tour-count {
          margin-bottom: 8px;
        }
        .website-builder-tour-buttons button {
          padding: 6px 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function clearUI() {
    if (activeLayoutHandler) {
      window.removeEventListener("resize", activeLayoutHandler);
      window.removeEventListener("scroll", activeLayoutHandler, true);
      activeLayoutHandler = null;
    }
    if (activeLayoutFrame) {
      cancelAnimationFrame(activeLayoutFrame);
      activeLayoutFrame = 0;
    }

    if (highlightedElement) {
      highlightedElement.classList.remove("website-builder-tour-highlight");
      highlightedElement = null;
    }
    if (arrowLayer) {
      arrowLayer.remove();
      arrowLayer = null;
    }
    if (card) {
      card.remove();
      card = null;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function getTopmost(selector) {
    var elements = document.querySelectorAll(selector);
    return elements.length ? elements[elements.length - 1] : null;
  }

  function resolveTarget(step) {
    if (!step) return null;
    if (typeof step.target === "function") return step.target();
    if (step.selector) return document.querySelector(step.selector);
    return null;
  }

  async function waitForTarget(step, timeoutMs) {
    var started = Date.now();
    var target = resolveTarget(step);
    while (!target && Date.now() - started < (timeoutMs || 2500)) {
      await waitMs(50);
      target = resolveTarget(step);
    }
    return target;
  }

  function getVisibleTargetRect(target) {
    if (!target) return null;

    var rect = target.getBoundingClientRect();
    var left = Math.max(0, Math.min(window.innerWidth, rect.left));
    var right = Math.max(0, Math.min(window.innerWidth, rect.right));
    var top = Math.max(0, Math.min(window.innerHeight, rect.top));
    var bottom = Math.max(0, Math.min(window.innerHeight, rect.bottom));

    if (right <= left || bottom <= top) return null;

    return {
      left: left,
      right: right,
      top: top,
      bottom: bottom,
      width: right - left,
      height: bottom - top,
      centerX: left + (right - left) / 2,
      centerY: top + (bottom - top) / 2
    };
  }

  function isTargetMeaningfullyVisible(target) {
    var rect = getVisibleTargetRect(target);
    return Boolean(rect && rect.width >= 20 && rect.height >= 20);
  }

  async function prepareTarget(step) {
    if (typeof step.beforeTarget === "function") {
      await step.beforeTarget();
    }

    if (!step.selector && typeof step.target !== "function") return null;

    var target = await waitForTarget(step, step.targetTimeout || 3000);
    if (!target || step.skipTargetScroll) return target;

    if (!isTargetMeaningfullyVisible(target)) {
      try {
        target.scrollIntoView({
          behavior: "auto",
          block: step.scrollBlock || "center",
          inline: "nearest"
        });
      }
      catch (error) {
        target.scrollIntoView();
      }

      await new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(resolve);
        });
      });
    }

    return target;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(value, maximum));
  }

  function chooseBestPlacement(targetRect, cardWidth, cardHeight, preferredPlacement) {
    var gap = 18;
    var margin = 12;
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var centeredLeft = (vw - cardWidth) / 2;
    var centeredTop = (vh - cardHeight) / 2;

    if (!targetRect) {
      return {
        left: clamp(centeredLeft, margin, Math.max(margin, vw - cardWidth - margin)),
        top: clamp(20, margin, Math.max(margin, vh - cardHeight - margin))
      };
    }

    var candidates = [];

    function addCandidate(name, left, top, availableWidth, availableHeight) {
      var fits = availableWidth >= cardWidth && availableHeight >= cardHeight;
      var overflow =
        Math.max(0, margin - left) +
        Math.max(0, left + cardWidth + margin - vw) +
        Math.max(0, margin - top) +
        Math.max(0, top + cardHeight + margin - vh);

      candidates.push({
        name: name,
        left: left,
        top: top,
        fits: fits,
        overflow: overflow
      });
    }

    addCandidate(
      "right",
      targetRect.right + gap,
      targetRect.centerY - cardHeight / 2,
      vw - targetRect.right - gap - margin,
      vh - 2 * margin
    );

    addCandidate(
      "left",
      targetRect.left - cardWidth - gap,
      targetRect.centerY - cardHeight / 2,
      targetRect.left - gap - margin,
      vh - 2 * margin
    );

    addCandidate(
      "below",
      targetRect.centerX - cardWidth / 2,
      targetRect.bottom + gap,
      vw - 2 * margin,
      vh - targetRect.bottom - gap - margin
    );

    addCandidate(
      "above",
      targetRect.centerX - cardWidth / 2,
      targetRect.top - cardHeight - gap,
      vw - 2 * margin,
      targetRect.top - gap - margin
    );

    if (preferredPlacement === "aboveRight") {
      addCandidate(
        "aboveRight",
        targetRect.right - cardWidth,
        targetRect.top - cardHeight - gap,
        vw - 2 * margin,
        targetRect.top - gap - margin
      );
    }

    var preferred = candidates.find(function (candidate) {
      return candidate.name === preferredPlacement && candidate.fits;
    });
    var selected = preferred ||
      candidates.find(function (candidate) { return candidate.fits; }) ||
      candidates.slice().sort(function (a, b) { return a.overflow - b.overflow; })[0];

    return {
      left: clamp(
        selected ? selected.left : centeredLeft,
        margin,
        Math.max(margin, vw - cardWidth - margin)
      ),
      top: clamp(
        selected ? selected.top : centeredTop,
        margin,
        Math.max(margin, vh - cardHeight - margin)
      )
    };
  }

  function nearestPointOnRect(rect, x, y) {
    return {
      x: clamp(x, rect.left + 6, Math.max(rect.left + 6, rect.right - 6)),
      y: clamp(y, rect.top + 6, Math.max(rect.top + 6, rect.bottom - 6))
    };
  }

  function removeArrow() {
    if (arrowLayer) {
      arrowLayer.remove();
      arrowLayer = null;
    }
  }

  function drawArrow(cardElement, target, direction) {
    removeArrow();
    if (!cardElement || !target) return;

    var cardRect = cardElement.getBoundingClientRect();
    var targetRect = getVisibleTargetRect(target);
    if (!targetRect) return;

    var targetPoint;
    if (direction === "downLeft") {
      targetPoint = {
        x: targetRect.left + targetRect.width * 0.36,
        y: targetRect.top + Math.min(26, targetRect.height * 0.12)
      };
    }
    else {
      targetPoint = nearestPointOnRect(
        targetRect,
        cardRect.left + cardRect.width / 2,
        cardRect.top + cardRect.height / 2
      );
    }

    var cardCenterX = cardRect.left + cardRect.width / 2;
    var cardCenterY = cardRect.top + cardRect.height / 2;
    var deltaX = targetPoint.x - cardCenterX;
    var deltaY = targetPoint.y - cardCenterY;
    var startX;
    var startY;

    if (direction === "downLeft") {
      startX = cardRect.left + cardRect.width * 0.28;
      startY = cardRect.bottom;
    }
    else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      startX = deltaX >= 0 ? cardRect.right : cardRect.left;
      startY = clamp(targetPoint.y, cardRect.top + 18, cardRect.bottom - 18);
    }
    else {
      startX = clamp(targetPoint.x, cardRect.left + 18, cardRect.right - 18);
      startY = deltaY >= 0 ? cardRect.bottom : cardRect.top;
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "website-builder-tour-arrow-layer");
    svg.setAttribute("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight);
    svg.setAttribute("preserveAspectRatio", "none");

    var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "websiteBuilderTourArrowHead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");

    var head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M0,0 L0,6 L9,3 z");
    head.setAttribute("fill", "#d32f2f");
    marker.appendChild(head);
    defs.appendChild(marker);
    svg.appendChild(defs);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "website-builder-tour-arrow-path");

    var controlX = (startX + targetPoint.x) / 2;
    var controlY = (startY + targetPoint.y) / 2;

    if (direction === "downLeft") {
      controlY = startY + Math.max(16, (targetPoint.y - startY) * 0.35);
    }
    else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      controlY = startY;
    }
    else {
      controlX = startX;
    }

    path.setAttribute(
      "d",
      "M " + startX + " " + startY +
      " Q " + controlX + " " + controlY +
      ", " + targetPoint.x + " " + targetPoint.y
    );
    path.setAttribute("marker-end", "url(#websiteBuilderTourArrowHead)");
    svg.appendChild(path);

    document.body.appendChild(svg);
    arrowLayer = svg;
  }

  function positionStepUI(step, target) {
    if (!card) return;

    var margin = 12;
    var gap = 14;
    var cardWidth = Math.min(step.width || 480, window.innerWidth - 24);
    card.style.width = cardWidth + "px";

    var cardHeight = Math.min(card.offsetHeight, Math.max(120, window.innerHeight - 24));
    var targetRect = getVisibleTargetRect(target);
    var placement;

    if (step.placement === "panelTop" && targetRect) {
      var centeredLeft = targetRect.centerX - cardWidth / 2;
      var preferredTop = targetRect.top - cardHeight - gap;

      placement = {
        left: clamp(
          centeredLeft,
          margin,
          Math.max(margin, window.innerWidth - cardWidth - margin)
        ),
        top: clamp(
          preferredTop,
          margin,
          Math.max(margin, window.innerHeight - cardHeight - margin)
        )
      };
    }
    else {
      placement = chooseBestPlacement(
        targetRect,
        cardWidth,
        cardHeight,
        step.placement
      );
    }

    card.style.left = placement.left + "px";
    card.style.top = placement.top + "px";

    drawArrow(card, target, step.arrowDirection);
  }

  function installLiveStepLayout(step, target) {
    activeLayoutHandler = function () {
      if (activeLayoutFrame) cancelAnimationFrame(activeLayoutFrame);
      activeLayoutFrame = requestAnimationFrame(function () {
        activeLayoutFrame = 0;
        positionStepUI(step, target);
      });
    };

    window.addEventListener("resize", activeLayoutHandler);
    window.addEventListener("scroll", activeLayoutHandler, true);
  }

  function clickElement(selector) {
    var element = getTopmost(selector);
    if (element) element.click();
    return Boolean(element);
  }

  function settingsTextPanel() {
    return document.getElementById("website_settings_text") ||
      document.querySelector(".website-settings-tab-panel.active");
  }

  function settingsStyleTab() {
    return document.querySelector('[data-tab="website_settings_display"]') ||
      Array.from(document.querySelectorAll(".website-settings-tab-button")).find(function (button) {
        return /style/i.test(button.textContent || "");
      });
  }

  function settingsStylePanel() {
    return document.getElementById("website_settings_display") ||
      document.querySelector(".website-settings-tab-panel.active");
  }

  function getSteps() {
    return [
      {
        title: "Welcome to the Website Builder Guided Tour",
        width: 560,
        body: '<p>In a few minutes, you will create a simple interactive tunebook website using 20 traditional Irish tunes.</p><p>The tour loads a ready-made example project, shows you the settings used to build the site, opens a real preview, and finishes with the normal website export process.</p>',
        afterNext: async function () {
          api.loadExampleProject(EXAMPLE_PROJECT);
          await waitMs(300);
        }
      },
      {
        title: "1. Example Project Loaded",
        selector: "#loaded-tunes-panel",
        width: 520,
        placement: "panelTop",
        arrowDirection: "downLeft",
        body: '<p>The embedded example project contains <strong>20 traditional Irish session tunes</strong>, including Cooley’s, The Kesh, The Banshee, Morrison’s, and The Wind That Shakes the Barley.</p><p>It uses the <strong>Traditional Irish Music</strong> theme and displays all of the tunes on one page using <strong>Multiple</strong> tune display.</p>'
      },
      {
        title: "2. Open the Website Settings",
        selector: "#settings-button",
        body: '<p>The example project already contains all of the settings needed to build the website.</p><p>Click <strong>Next</strong> to open the real <strong>Website Settings</strong> dialog and review the most important choices.</p>',
        afterNext: async function () {
          api.openSettings();
          await waitMs(550);
        }
      },
      {
        title: "3. Title, Subtitle, and Footer",
        target: settingsTextPanel,
        width: 500,
        body: '<p>The example project includes a website title, subtitle, and footer. These appear in the generated website and give the tunebook a finished appearance.</p><p>It also enables a title page when the website is printed.</p>'
      },
      {
        title: "4. Style & Site Options",
        target: settingsStyleTab,
        body: '<p>Click <strong>Next</strong> to open the <strong>Style & Site Options</strong> tab and review the main layout and navigation choices used by the example project.</p>',
        afterNext: async function () {
          var tab = settingsStyleTab();
          if (tab) tab.click();
          await waitMs(250);
        }
      },
      {
        title: "5. A Simple Interactive Tunebook",
        target: settingsStylePanel,
        width: 540,
        body: '<p>The example project uses <strong>Multiple</strong> tune display, tune numbers, a Table of Contents with a search bar, and a Display / Instrument selector.</p><p>It also adds <strong>Play in ABC Transcription Tools</strong> buttons so each tune can be opened directly in the player.</p>'
      },
      {
        title: "6. Apply the Example Settings",
        target: function () { return getTopmost(".modal_flat_ok, .modal_default_ok, [class*='modal_'][class*='_ok']"); },
        body: '<p>No changes are needed. Click <strong>Next</strong> to apply the example settings and return to the main Website Builder window.</p>',
        afterNext: async function () {
          api.applyOpenSettingsDialog();
          await waitMs(350);
        }
      },
      {
        title: "7. Preview the Website",
        selector: "#preview-button",
        width: 520,
        body: '<p><strong>Preview</strong> builds the example website and opens it in a new browser tab without saving a file.</p><p>Click <strong>Next</strong>, explore the preview, then click <strong>Close Preview</strong> to return to the Website Builder and continue the tour.</p>',
        afterNext: async function () {
          var previewWindow = await api.previewSite();
          if (previewWindow) {
            await waitForPreviewReturn();
          }
          else {
            await waitMs(250);
          }
        }
      },
      {
        title: "Preview Complete",
        target: function () { return document.getElementById("preview-button"); },
        body: '<p>You have returned to the Website Builder after reviewing the generated website.</p><p>Click <strong>Next</strong> when you are ready to build and save the website file.</p>'
      },
      {
        title: "8. Build and Save the Website",
        selector: "#save-button",
        width: 520,
        finalActionLabel: "Open Save Dialog",
        body: '<p>You have loaded an example project, reviewed its settings, and previewed the generated website.</p><p>Click <strong>Open Save Dialog</strong> to finish the tour, choose a filename, and save the completed website.</p><p>After the export is complete, the website file will normally be in your browser’s default <strong>Downloads</strong> directory.</p>',
        afterDone: function () {
          void api.saveSite();
        }
      }
    ];
  }

  function showStep(step, index, total) {
    return new Promise(async function (resolve) {
      clearUI();

      var target = await prepareTarget(step);
      if (target) {
        target.classList.add("website-builder-tour-highlight");
        highlightedElement = target;
      }

      overlay = document.createElement("div");
      overlay.className = "website-builder-tour-overlay";
      document.body.appendChild(overlay);

      card = document.createElement("div");
      card.className = "website-builder-tour-card";
      var last = index === total - 1;
      card.innerHTML =
        "<h2>" + step.title + "</h2>" +
        step.body +
        '<div class="website-builder-tour-footer">' +
          '<div class="website-builder-tour-count">Step ' + (index + 1) + " of " + total + "</div>" +
          '<div class="website-builder-tour-buttons">' +
            '<button type="button" data-action="exit">Close Tour</button>' +
            '<button type="button" data-action="' + (last ? "done" : "next") + '">' +
              (last ? (step.finalActionLabel || "Done") : "Next") +
            "</button>" +
          "</div>" +
        "</div>";
      document.body.appendChild(card);

      positionStepUI(step, target);
      installLiveStepLayout(step, target);

      Array.prototype.forEach.call(card.querySelectorAll("button[data-action]"), function (button) {
        button.addEventListener("click", function () {
          var action = button.getAttribute("data-action") || "exit";
          clearUI();
          resolve(action);
        });
      });

      overlay.addEventListener("click", function () {
        clearUI();
        resolve("exit");
      }, { once: true });
    });
  }

  function isWebsiteBuilderTourDesktopBrowser() {
    var ua = navigator.userAgent || "";
    var mobileUA = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua);
    var finePointer = !window.matchMedia || window.matchMedia("(pointer: fine)").matches;
    var hoverCapable = !window.matchMedia || window.matchMedia("(hover: hover)").matches;
    return !mobileUA && finePointer && hoverCapable;
  }

  function updateWebsiteBuilderTourButtonVisibility() {
    var button = document.getElementById("website-builder-guided-tour-launch-button");
    if (!button) return;
    button.style.display = isWebsiteBuilderTourDesktopBrowser() ? "block" : "none";
  }

  function confirmReplaceCurrentWork() {
    return new Promise(function (resolve) {
      clearUI();

      overlay = document.createElement("div");
      overlay.className = "website-builder-tour-overlay";
      document.body.appendChild(overlay);

      card = document.createElement("div");
      card.className = "website-builder-tour-card";
      card.style.width = Math.min(520, window.innerWidth - 24) + "px";
      card.innerHTML =
        "<h2>Start the Guided Tour?</h2>" +
        "<p>Starting the Guided Tour will replace the currently loaded tunes and settings with an example project. Save your current project before continuing.</p>" +
        '<div class="website-builder-tour-footer">' +
          '<div class="website-builder-tour-buttons">' +
            '<button type="button" data-action="cancel">Cancel</button>' +
            '<button type="button" data-action="start">Start Tour</button>' +
          "</div>" +
        "</div>";
      document.body.appendChild(card);

      var cardHeight = Math.min(card.offsetHeight, Math.max(120, window.innerHeight - 24));
      card.style.left = Math.max(12, (window.innerWidth - card.offsetWidth) / 2) + "px";
      card.style.top = Math.max(12, (window.innerHeight - cardHeight) / 3) + "px";

      function finish(shouldStart) {
        clearUI();
        resolve(shouldStart);
      }

      var cancelButton = card.querySelector('[data-action="cancel"]');
      var startButton = card.querySelector('[data-action="start"]');

      if (cancelButton) {
        cancelButton.addEventListener("click", function () {
          finish(false);
        });
      }

      if (startButton) {
        startButton.addEventListener("click", function () {
          finish(true);
        });
      }

      overlay.addEventListener("click", function () {
        finish(false);
      }, { once: true });
    });
  }

  async function runTour() {
    if (tourRunning) return;
    if (!isWebsiteBuilderTourDesktopBrowser()) return;
    api = window.WebsiteBuilderGuidedTourAPI;
    if (!api) return;

    injectStyles();

    if (typeof api.hasLoadedTunes === "function" && api.hasLoadedTunes()) {
      var confirmed = await confirmReplaceCurrentWork();
      if (!confirmed) return;
    }

    tourRunning = true;

    try {
      var steps = getSteps();
      for (var index = 0; index < steps.length; index++) {
        var step = steps[index];
        var action = await showStep(step, index, steps.length);

        if (action === "next") {
          if (typeof step.afterNext === "function") await step.afterNext();
          continue;
        }

        if (action === "done" && typeof step.afterDone === "function") {
          step.afterDone();
        }
        break;
      }
    } finally {
      clearUI();
      tourRunning = false;
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target && event.target.closest
      ? event.target.closest("#website-builder-guided-tour-launch-button")
      : null;
    if (!button) return;
    event.preventDefault();
    void runTour();
  });

  window.StartWebsiteBuilderGuidedTour = runTour;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(updateWebsiteBuilderTourButtonVisibility, 0);
    }, { once: true });
  }
  else {
    setTimeout(updateWebsiteBuilderTourButtonVisibility, 0);
  }
})();
