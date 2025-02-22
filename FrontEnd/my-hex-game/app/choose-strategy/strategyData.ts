export const strategyData: Record<string, string> = {
    "Strategy 1": `t = t + 1  # keeping track of the turn number
  m = 0  # number of random moves this turn
  while (3 - m) {  # made less than 3 random moves
    if (budget - 100) then {} else done  # too poor to do anything else
    opponentLoc = opponent
    if (opponentLoc / 10 - 1)
    then  # opponent afar
      if (opponentLoc % 10 - 5) then move downleft
      else if (opponentLoc % 10 - 4) then move down
      else if (opponentLoc % 10 - 3) then move downright
      else if (opponentLoc % 10 - 2) then move right
      else if (opponentLoc % 10 - 1) then move upright
      else move up
  }`,
  
    "Strategy 2": `t = t + 1  # keeping track of the turn number
  m = 0  # number of defensive moves this turn
  while (3 - m) {  # made less than 3 defensive moves
    if (budget - 100) then {} else done  # too poor to do anything
    opponentLoc = opponent
    if (opponentLoc / 10 - 1)
    then  # opponent detected, decide whether to flee or block
      if (opponentLoc % 10 - 5) then move upleft
      else if (opponentLoc % 10 - 4) then move up
      else if (opponentLoc % 10 - 3) then move upright
      else if (opponentLoc % 10 - 2) then move right
      else if (opponentLoc % 10 - 1) then move downright
      else move down
    else if (opponentLoc)
    then  # opponent adjacent, prioritize defense
      shield = 5 * (nearby % 100)  # calculate shield cost based on nearby enemies
      if (budget - shield) then activate shield shield else {}
  
    else {  # no visible opponent; reposition strategically
      try = 0  # keep track of number of attempts
      while (3 - try) {  # no more than 3 attempts
        success = 1
        dir = random % 6
        # (nearby <dir> % 10 + 1) ^ 2 is positive if adjacent cell is safe
        if ((dir - 4) * (nearby upleft % 10 + 1) ^ 2) then move upleft
        else if ((dir - 3) * (nearby up % 10 + 1) ^ 2) then move up
        else if ((dir - 2) * (nearby upright % 10 + 1) ^ 2) then move upright
        else if ((dir - 1) * (nearby right % 10 + 1) ^ 2) then move right
        else if (dir * (nearby downright % 10 + 1) ^ 2) then move downright
        else if ((nearby down % 10 + 1) ^ 2) then move down
        else success = 0
        if (success) then try = 3 else try = try + 1
      }
      m = m + 1
    }
  }  # end while`,
  };
  