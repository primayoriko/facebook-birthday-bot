require("dotenv").config({ path: `${__dirname}/../../../.env` });

const 
	supertest = require("supertest"),
	chai = require("chai"),
	app = require("../../../src/app"),
	userService = require("../../../src/services/postgres/user"),
	messageService = require("../../../src/services/postgres/message"),
	api = supertest.agent(app);

chai.should();

const 
	userData = [
		[123, "naufal"],
		[456, "prima"],
		[789, "yoriko"]
	],
	messageData = [
		[123, "halo salam kenal!"],
		[456, "besok saya perlu ke kantor"],
		[123, "nama saya naufal."]
	];

describe("Message API", () => {
	before(async () => {
		for(let i = 0; i < userData.length; i++) {
			await userService.insertUser(...userData[i]);
		}

		for(let i = 0; i < messageData.length; i++) {
			await messageService.insertMessage(...messageData[i]);
		}
	});

	describe("Retrieve all messages", () => {
		it("should get all messages in correct order (ascending by ID)", () => {
			api.get("/messages")
				.end((err, res) => {
					res.status.should.equal(200);
					res.body.length.should.equal(messageData.length);
					for (let i = 0; i < messageData.length; i++) {
						res.body[i].message_text.should.equal(messageData[i][1]);
						res.body[i].user_psid.should.equal(messageData[i][0]);
						res.body[i].id.should.equal(i + 1);
					}
				});
		});
	});

	describe("Retrieve message with specified ID", () => {
		it("should get message with existing ID", () => {
			const id = 1;
			api.get(`/messages/${id}`)
				.end((err, res) => {
					res.status.should.equal(200);
					res.body.message_text.should.equal(messageData[id - 1][1]);
					res.body.user_psid.should.equal(messageData[id - 1][0]);
					res.body.id.should.equal(id);
				});
		});

		it("should get status 404 when specified with unexisting ID", () => {
			const id = 999;
			api.get(`/messages/${id}`)
				.end((err, res) => {
					res.status.should.equal(404);
				});
		});
	});

	describe("Retrieve summary of messages", () => {
		it("should show summary in correct order (ascending by user PSID then message ID)", () => {
			api.get("/summary")
				.end((err, res) => {
					res.status.should.equal(200);
					res.body.length.should.equal(userData.length());
					for (let i = 0; i < userData.length; i++) {
						const messages = messageData.filter(message => message[0] === userData[0]);
						res.body[i].messages.length.should.equal(messages.length);
						for (let j = 0; j < messages.length; j++) {
							res.body[i].messages[j].should.equal(messages[j][1]);
						}
					}
				});
		});
	});
});
