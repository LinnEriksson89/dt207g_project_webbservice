/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

//A small program that generates secrets for JWTs.

//Requirements
const crypto = require("crypto");

//Generate 64 random bytes and convert to a string with letters and numbers.
console.log(crypto.randomBytes(64).toString("hex"));