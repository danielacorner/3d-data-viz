import { getDomeOfPositionsAround } from "../../../utils/constants";
import { PlayerType } from "./Youtubes";

export function findAdjacentUnoccupiedPositionsTo(
  position: [number, number, number],
  players: PlayerType[]
): [number, number, number][] {
  // given all players and the current position, find the adjacent players ()
  const allPlayerPositions = players.map((p) => p.position);
  const allAdjacentPositions = getDomeOfPositionsAround(position);
  const unoccupiedAdjacentPositions = allAdjacentPositions.filter(
    (p) => !JSON.stringify(allPlayerPositions).includes(JSON.stringify(p))
  );

  return unoccupiedAdjacentPositions;
}

/**generate an 11 character youtube video ID.
 * It might not be valid...
 */
export function getRandomVideoId() {
  var codeLength = 11;
  var possibles =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
  var code = "";
  for (var i = 0; i < codeLength; i++) {
    code += possibles.charAt(Math.floor(Math.random() * possibles.length));
  }
  return code;
}
