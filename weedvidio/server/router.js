const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4')

// time between pollings
const USER_COUNT_TIME_MS = 10000

var needToMeet = []
var currentUserCount = 0
var lastCurrentUserCount = 0

const upUserCount = () => {
	currentUserCount += 1
}

const downUserCount = () => {
	currentUserCount -= 1
}

const removeFromNeedToMeet = (userId) => {
	var index = needToMeet.indexOf(userId)
	if(index != -1) {
		needToMeet.splice(index,1)
	}
}

router.get('/here', function(req, res, next){
	console.log("hit here")
	res.json({data:"Working"})
})

router.post('/getNewPartner', function(req, res, next){
	var userId = req.body.userId
	var partnerId = req.body.partnerId
	if(userId) {
		if(needToMeet.includes(userId)) {
			res.json({success: true})
		}
		else if (needToMeet.length > 0) {
			var newPartner = needToMeet.pop()
			// concurrency issues, check it exists
			if(newPartner) {
				console.log(userId + " is calling " + newPartner)
				res.json({success: true, data: {action: "call", partnerId: newPartner}})
			} else {
				console.log(userId + " is listening")
				needToMeet.push(userId)
				res.json({success: true, data: {action: "listen"}})
			}
		} else {
			console.log(userId + " is listening")
			needToMeet.push(userId)
			res.json({success: true, data:{action: "listen"}})
		}
		
	} else {
		res.json({success: false})
	}
})

// return a new userId
router.post('/setUp', function(req, res, next){
	currentUserCount = currentUserCount + 1
	var userId = req.body.userId
	if (userId) {
		res.json({success: true, data: {userId: userId, userCount: lastCurrentUserCount}})
	} else {
		const newId = uuidv4();
		res.json({success: true, data: {userId: newId, userCount: lastCurrentUserCount}})
	}
})

// remove userId from needToMeet list
router.post('/exited', function(req, res, next){
	var userId = req.body.userId
	var index = needToMeet.indexOf(userId)
	needToMeet.splice(index,1)
	if(userId) {
		if(needToMeet.includes(userId)) {
			res.json({success: true})
		}
	}
})

router.post('/stopListening', function(req, res, next){
	var userId = req.body.userId
	if(userId) {
		if(needToMeet.includes(userId)) {
			var index = needToMeet.indexOf(userId)
			needToMeet.splice(index,1)
		}
	}
	res.json({success: true})
})


router.post('/ping', function(req, res, next) {
	// var userId = req.body.userId
	// currentUserCount = currentUserCount + 1
	res.json({success: true, 'userCount': currentUserCount})
})

// setInterval(() => {
// 	lastCurrentUserCount = currentUserCount;
// 	currentUserCount = 0;
// }, USER_COUNT_TIME_MS)


module.exports = { router, removeFromNeedToMeet, upUserCount, downUserCount }