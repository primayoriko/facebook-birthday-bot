function findDaysLeftTillNextBirthdayFromNow(birthDateText) {
	const
		currDate = new Date(), 
		birthDateArr = birthDateText
			.split("-")
			.map(num => parseInt(num));

	let birthDate = new Date(currDate.getFullYear(), birthDateArr[1] - 1, birthDateArr[2]);
    
	if (birthDate < currDate) {
		birthDate = new Date(currDate.getFullYear() + 1, birthDateArr[1] - 1, birthDateArr[2]);
	}

	return Math.ceil((birthDate - currDate)/(1000*60*60*24));
}

function createFBGenericChatboxForAskNextBirthday(birthDateText) {
	const 
		positive_response_payload = JSON.stringify({
			"findNextDate": true,
			"date": birthDateText,
			"text": "yes"
		}),
		negative_response_payload = JSON.stringify({
			"findNextDate": false,
			"text": "no"
		});

	return {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": `Your birth date is on ${birthDateText}`,
					"subtitle": "Find your how many days left until your next birthday?",
					"buttons": [
						{
							"type": "postback",
							"title": "yes",
							"payload": positive_response_payload,
						},
						{
							"type": "postback",
							"title": "no",
							"payload": negative_response_payload,
						}
					],
				}]
			}
		}
	};
}

module.exports = {
	findDaysLeftTillNextBirthdayFromNow,
	createFBGenericChatboxForAskNextBirthday
};
