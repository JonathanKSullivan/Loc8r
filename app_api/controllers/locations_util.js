// Internal functions
const hoursToMinutes = hours => {
  return 60 * hours
}

const convertTimeStringToMinutesFromMidnight = (time, isDisabled) => {
  console.log("DEBUG-isDisabled-"+isDisabled)
  if(!isDisabled){
    const timeNum = time.split(' ')[0]
    const hour = parseInt(timeNum.split(':')[0])
    const minutes = parseInt(timeNum.split(':')[1])
    const amPm = time.split(' ')[1]
    // console.log("DEBUG-"+amPm)
    let minutesFromMidnight = amPm.toLowerCase() === 'pm' ? hoursToMinutes(12) : 0
    minutesFromMidnight += hoursToMinutes(hour)
    minutesFromMidnight += minutes
    console.log("DEBUG-minutesFromMidnight-"+minutesFromMidnight)
    return minutesFromMidnight
  }
}

const zipOpeningTimes = (days, openings, closings, closeds) => {
  return days.map((day, i) => {
    return [
      day,
      openings[i],
      closings[i],
      closeds[i]
    ]
  })
}

// Exported functions
const setOpeningTimes = (days, openings, closings, closeds) => {
  const openingsTimes = zipOpeningTimes(days, openings, closings, closeds)
  return openingsTimes.map( openingsTime => {
    console.log("DEBUG-"+openingsTime[1]+" "+!openingsTime[3].includes("true"))
    console.log("DEBUG-"+openingsTime[2]+" "+!openingsTime[3].includes("true"))
    const closed_val = openingsTime[3].includes("true")
    console.log("DEBUG-close"+convertTimeStringToMinutesFromMidnight(openingsTime[1], closed_val))
    return {
      days: openingsTime[0],
      opening: convertTimeStringToMinutesFromMidnight(openingsTime[1], closed_val),
      closing: convertTimeStringToMinutesFromMidnight(openingsTime[2], closed_val),
      closed: closed_val
    }
  })
}

const buildListOfLocations = results => {
  return results.map(result => {
    return {
      id: result._id,
      name: result.name,
      address: result.address,
      rating: result.rating,
      facilities: result.facilities,
      distance: `${result.distance.calculated.toFixed()}m`
    }
  })
}

module.exports = {
  buildListOfLocations,
  setOpeningTimes
}
