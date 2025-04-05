const formatTime = (time24) => {
  if(time24.includes('M')) return time24;

  let [hour, minute] = time24.split(":")
  hour = parseInt(hour, 10)
  const modifier = hour >= 12 ? "PM" : "AM"
  if (hour > 12) hour -= 12
  if (hour === 0) hour = 12
  return `${hour}:${minute} ${modifier}`
}

export default formatTime
