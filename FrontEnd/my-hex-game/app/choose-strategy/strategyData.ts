export const strategyData: { [key: string]: string } = {
  "Strategy 1": `t = 0   
t = t + 1
m = 0 
while (3 - m) {  
  if (budget - 100) then {} else done  
  opponentLoc = opponent
  if (opponentLoc / 10 - 1)
  then  
    if (opponentLoc % 10 - 5) then move downleft
    else if (opponentLoc % 10 - 4) then move down
    else if (opponentLoc % 10 - 3) then move downright
    else if (opponentLoc % 10 - 2) then move upleft
    else if (opponentLoc % 10 - 1) then move upright
    else move up
  else if (opponentLoc)
  then  
    if (opponentLoc % 10 - 5) then {
      cost = 10 ^ (nearby upleft % 100 + 1)
      if (budget - cost) then shoot upleft cost else {}
    }
    else if (opponentLoc % 10 - 4) then {
      cost = 10 ^ (nearby downleft % 100 + 1)
      if (budget - cost) then shoot downleft cost else {}
    }
    else if (opponentLoc % 10 - 3) then {
      cost = 10 ^ (nearby down % 100 + 1)
      if (budget - cost) then shoot down cost else {}
    }
    else if (opponentLoc % 10 - 2) then {
      cost = 10 ^ (nearby downright % 100 + 1)
      if (budget - cost) then shoot downright cost else {}
    }
    else if (opponentLoc % 10 - 1) then {
      cost = 10 ^ (nearby upright % 100 + 1)
      if (budget - cost) then shoot upright cost else {}
    }
    else {
      cost = 10 ^ (nearby up % 100 + 1)
      if (budget - cost) then shoot up cost else {}
    }
  else {  
    try = 0  
    while (3 - try) { 
      success = 1
      dir = random % 6
      if ((dir - 4) * (nearby upleft % 10 + 1) ^ 2) then move upleft
      else if ((dir - 3) * (nearby downleft % 10 + 1) ^ 2) then move downleft
      else if ((dir - 2) * (nearby down % 10 + 1) ^ 2) then move down
      else if ((dir - 1) * (nearby downright % 10 + 1) ^ 2) then move downright
      else if (dir * (nearby upright % 10 + 1) ^ 2) then move upright
      else if ((nearby up % 10 + 1) ^ 2) then move up
      else success = 0
      if (success) then try = 3 else try = try + 1
    }
    m = m + 1
  }
}  `,

  "Strategy 2": `t = 0   
t = t + 1
m = 0 
while (3 - m) {  
  if (budget - 100) then {} else done  
  opponentLoc = opponent
  if (opponentLoc / 10 - 1)
  then  
    if (opponentLoc % 10 - 5) then move downleft
    else if (opponentLoc % 10 - 4) then move down
    else if (opponentLoc % 10 - 3) then move downright
    else if (opponentLoc % 10 - 2) then move upleft
    else if (opponentLoc % 10 - 1) then move upright
    else move up
  else if (opponentLoc)
  then  
    if (opponentLoc % 10 - 5) then {
      cost = 10 ^ (nearby upleft % 100 + 1)
      if (budget - cost) then shoot upleft cost else {}
    }
    else if (opponentLoc % 10 - 4) then {
      cost = 10 ^ (nearby downleft % 100 + 1)
      if (budget - cost) then shoot downleft cost else {}
    }
    else if (opponentLoc % 10 - 3) then {
      cost = 10 ^ (nearby down % 100 + 1)
      if (budget - cost) then shoot down cost else {}
    }
    else if (opponentLoc % 10 - 2) then {
      cost = 10 ^ (nearby downright % 100 + 1)
      if (budget - cost) then shoot downright cost else {}
    }
    else if (opponentLoc % 10 - 1) then {
      cost = 10 ^ (nearby upright % 100 + 1)
      if (budget - cost) then shoot upright cost else {}
    }
    else {
      cost = 10 ^ (nearby up % 100 + 1)
      if (budget - cost) then shoot up cost else {}
    }
  else {  
    try = 0  
    while (3 - try) { 
      success = 1
      dir = random % 6
      if ((dir - 4) * (nearby upleft % 10 + 1) ^ 2) then move upleft
      else if ((dir - 3) * (nearby downleft % 10 + 1) ^ 2) then move downleft
      else if ((dir - 2) * (nearby down % 10 + 1) ^ 2) then move down
      else if ((dir - 1) * (nearby downright % 10 + 1) ^ 2) then move downright
      else if (dir * (nearby upright % 10 + 1) ^ 2) then move upright
      else if ((nearby up % 10 + 1) ^ 2) then move up
      else success = 0
      if (success) then try = 3 else try = try + 1
    }
    m = m + 1
  }
}    `,

  // Strategy 3 ไม่มี default code
  "Strategy 3": ``
};
