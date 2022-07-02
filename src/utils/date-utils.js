function findDaysLeftTillNextBirthdayFromNow(birthDateStr) {
	const
		currDate = new Date(), 
		birthDateArr = birthDateStr
			.split("-")
			.map(num => parseInt(num));

	let birthDate = new Date(currDate.getFullYear(), birthDateArr[1] - 1, birthDateArr[2]);
    
	if (birthDate < currDate) {
		birthDate = new Date(currDate.getFullYear() + 1, birthDateArr[1] - 1, birthDateArr[2]);
	}

	return Math.ceil((birthDate - currDate)/(1000*60*60*24));
}

module.exports = {
	findDaysLeftTillNextBirthdayFromNow
};
