// Internal functions
const hoursToMinutes = hours => {
  return 60 * hours
}

const convertTimeStringToMinutesFromMidnight = times => {
  return times.map(time => {
    const timeNum = time.split(' ')[0]
    const hour = timeNum.split(':')[0]
    const minutes = timeNum.split(':')[1]
    const amPm = time.split(' ')[1]
    let minutesFromMidnight = amPm.toLowerCase() === 'pm' ? hoursToMinutes(12) : 0
    minutesFromMidnight += hoursToMinutes(hour)
    minutesFromMidnight += minutes
    return minutesFromMidnight
  })
}

const zipOpeningTimes = (days, openings, closings, closeds) => {
  days.map((day, i) => {
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
  openingsTimes.map(openingsTime => {
    return {
      day: openingsTime[0],
      openings: convertTimeStringToMinutesFromMidnight(openingsTime[1]),
      closings: convertTimeStringToMinutesFromMidnight(openingsTime[2]),
      closed: openingsTime[3]
    }
  })
}

const buildListOfLocations = results => {
  results.map(result => {
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
