const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')

const dbpath = path.join(__dirname, 'cricketTeam.db')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

let db = null
const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server Running at http://localhost:3000')
    })
  } catch (e) {
    console.log(e)
  }
}

initializeDBandServer()

//get player API
app.get('/players/', async (request, response) => {
  const getplayerQuery = `select * from cricket_Team`
  const playersArray = await db.all(getplayerQuery)
  const ans = eachObj => {
    console.log(eachObj.role)
    return {
      playerId: eachObj.player_id,
      playerName: eachObj.player_name,
      jerseyNumber: eachObj.jersey_number,
      role: eachObj.role,
    }
  }
  response.send(playersArray.map(eachplayer => ans(eachplayer)))
})

// post playerDetail API

app.post('/players/', async (request, response) => {
  const getP = `select count(*) as count from cricket_Team`
  const playerscountArray = await db.all(getP)
  console.log(playerscountArray)
  let player_id = playerscountArray[0].count + 2

  const {playerName, jerseyNumber, role} = request.body
  console.log(request.body)
  console.log(player_id)
  console.log(playerName)
  console.log(jerseyNumber)
  console.log(role)
  const setPlayerQuery = `
    INSERT INTO cricket_team(player_id,player_name,jersey_number,role)
    VALUES
    (
      ${player_id},'${playerName}',${jerseyNumber},'${role}'
    );
  `
  await db.run(setPlayerQuery)
  response.send('Player Added to Team')
})

//GET single player API

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  console.log(playerId)
  const getPlayerQuery = `
    select * from cricket_team where player_id = ${playerId};
  `
  const playerArray = await db.get(getPlayerQuery)
  console.log(playerArray)
  const ans = obj => {
    return {
      playerId: obj.player_id,
      playerName: obj.player_name,
      jerseyNumber: obj.jersey_number,
      role: obj.role,
    }
  }
  response.send(ans(playerArray))
})

//update playerDetails API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params;
  const {playerName, jerseyNumber, role} = request.body;
  const updateplayerQuery = `
    UPDATE cricket_team 
    SET 
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE 
      player_id = ${playerId};
  `
  await db.run(updateplayerQuery)
  response.send('Player Details Updated')
})

// delete playerDetails API

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  console.log(playerId)
  const deletePlayerQuery = `
    Delete from cricket_team 
    where player_id = ${playerId};
  `
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
