'use strict';
const {
  isWindows,
  isSunOS,
  isAIX,
  isLinuxPPCBE,
  isFreeBSD
module.exports = {
  isCPPSymbolsNotMapped: isWindows ||
                         isSunOS ||
                         isAIX ||
                         isLinuxPPCBE ||
                         isFreeBSD
};
