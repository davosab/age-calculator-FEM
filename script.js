const
  // Input
  inputSection = document.getElementById("input"),
  inputDay = document.getElementById("input-day"),
  inputMonth = document.getElementById("input-month"),
  inputYear = document.getElementById("input-year"),
  
  // Button
  button = document.getElementById("button"),

  // Dates
  date = new Date(),
  dateEntered = new Date(),

  monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  currentDate = date.getDate(),
  currentMonth = date.getMonth() + 1,
  currentYear = date.getFullYear(),
  
  // Output
  yearsOutput = document.getElementById("years"),
  monthsOutput = document.getElementById("months"),
  daysOutput = document.getElementById("days"),

  // Errors
  dayError = inputDay.nextElementSibling,
  monthError = inputMonth.nextElementSibling,
  yearError = inputYear.nextElementSibling,

  fieldRequired = "This field is required",

  invalidDay = "Must be a valid day",
  invalidDayOfMonth = "Must be a valid date",
  invalidMonth = "Must be a valid Month",
  future = "Must be in the past",

  notNumber = "Must be a number";

// Functions

function calculateAge() {
let
  nrYears = currentYear - inputYear.value,
  nrMonths = currentMonth - inputMonth.value,
  nrDays = currentDate - inputDay.value;
  
  // Months
  if (inputMonth.value > currentMonth) {
    // go back months
    nrMonths = 12 - Math.abs(currentMonth - inputMonth.value);
    // take away a year aswell
    nrYears -= 1;
  }
  // Days
  // if input day > current date
  if (inputDay.value > currentDate) {
    // days = nr. of days in input month - input day + current date
    nrDays = monthDays[inputMonth.value - 1] - inputDay.value +
      currentDate;
    
    // go back one month
    switch (nrMonths) {
      case 0:
        nrMonths = 11;
        nrYears -= 1;
        break;
      default:
        nrMonths -= 1;
    }
  }
  animateAge(nrYears, nrMonths, nrDays);
}

function animateAge(y, m, d) {
  yearsOutput.innerHTML = 0;
  monthsOutput.innerHTML = 0;
  daysOutput.innerHTML = 0;
  // Years
  const animateYears = new Promise((resolve) => {
    let timer = setInterval(updateYears, 20);
    yearsOutput.innerHTML = 0;
    function updateYears() {
      if (yearsOutput.innerHTML == y) {
        clearInterval(timer);
        yearsOutput.nextSibling.nodeValue = " years";
        if (yearsOutput.innerHTML == 1)
          yearsOutput.nextSibling.nodeValue = " year";
        resolve();
        return;
      }
      yearsOutput.innerHTML = Number(yearsOutput.innerHTML) + 1;
    }
  });
  animateYears.then(() => {
    // Months
    const animateMonths = new Promise((resolve) => {
      let timer = setInterval(updateMonths, 20);
      monthsOutput.innerHTML = 0;
      function updateMonths() {
        if (monthsOutput.innerHTML == m) {
          clearInterval(timer);
          monthsOutput.nextSibling.nodeValue = " months";
          if (monthsOutput.innerHTML == 1)
            monthsOutput.nextSibling.nodeValue = " month";
          resolve();
          return;
        }
        monthsOutput.innerHTML = Number(monthsOutput.innerHTML) + 1;
      }
    });
    animateMonths.then(() => {animateDays()});
  });
  
  // Days
  function animateDays() {
    daysOutput.innerHTML = 0;
    let timer = setInterval(updateDays, 20);
    function updateDays() {
      if (daysOutput.innerHTML == d) {
        clearInterval(timer);
        daysOutput.nextSibling.nodeValue = " days";
        if (daysOutput.innerHTML == 1)
          daysOutput.nextSibling.nodeValue = " day";
        return;
      }
      daysOutput.innerHTML = Number(daysOutput.innerHTML) + 1;
    }
  }
}

function validateDate() {
  // remove previous errors
  inputSection.classList.remove("red", "bounce-animation");
  // force reflow in DOM so animation resets
  inputSection.offsetHeight;
  // set date entered by user
  dateEntered.setFullYear(inputYear.value, inputMonth.value - 1, inputDay.value);
  // check if all are valid
  return (validateDay() & validateMonth() & validateYear());
}

function validateDay() {
  dayError.style.display = "block";
  // if input is empty...
  if (inputDay.value.trim() == "") {
    dayError.innerHTML = fieldRequired;
    return 0;
  }
  // if NaN
  if (isNaN(inputDay.value)) {
    dayError.innerHTML = notNumber;
    return 0;
  }
  // if date is not between 1 - 31...
  if (inputDay.value > 31 || inputDay.value < 1) {
    dayError.innerHTML = invalidDay;
    return 0;
  }
  // if February on a leap year...
  if (inputMonth.value == 2 && inputYear.value % 4 == 0) {
    monthDays.splice(1, 1, 29);
  } else {
  // reset days in february to 28
  monthDays.splice(1, 1, 28);    
  }
  // if month doesn't have that many days ex: 31 April...
  if (inputDay.value > monthDays[inputMonth.value - 1]) {
    dayError.innerHTML = invalidDayOfMonth;
    return 0;
  }
  if (dateEntered > date && inputMonth.value == date.getMonth() + 1 && 
    inputYear.value == currentYear) {
    dayError.innerHTML = future;
    return 0;
    }
  // if day is valid...
  dayError.style.display = "none";
  return 1;
}

function validateMonth() {
  monthError.style.display = "block";
  // if input is empty...
  if (inputMonth.value.trim() == "") {
    monthError.innerHTML = fieldRequired;
    return 0;
  }
  // if NaN
  if (isNaN(inputMonth.value)) {
    monthError.innerHTML = notNumber;
    return 0;
  }
  // if month is not between 1 - 12...
  if (inputMonth.value > 12 || inputMonth.value < 1) {
    monthError.innerHTML = invalidMonth;
    return 0;
  }
  // if future date, and year is the same...
  if (dateEntered > date && inputYear.value == currentYear) {
    // if future month...
    if (inputMonth.value > currentMonth) {
      monthError.innerHTML = future;
      return 0;
    }
  }
  // if month is valid...
  monthError.style.display = "none";
  return 1;
}

function validateYear() {
  yearError.style.display = "block";
  // if input is empty...
  if (inputYear.value.trim() == "") {
    yearError.innerHTML = fieldRequired;
    return 0;
  }
  // if NaN
  if (isNaN(inputYear.value)) {
    yearError.innerHTML = notNumber;
    return 0;
  }
  // if future year...
  if (inputYear.value > currentYear) {
    yearError.innerHTML = future;
    return 0;
  }
  // If year is valid...
  yearError.style.display = "none";
  return 1;
}

function showErrors() {
  inputSection.classList.add("red", "bounce-animation");
  // give blank results 
  yearsOutput.innerHTML = "- -";
  monthsOutput.innerHTML = "- -";
  daysOutput.innerHTML = "- -";
}

// Events
button.onclick = () => validateDate() ? calculateAge() : showErrors();

