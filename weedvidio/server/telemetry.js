const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4')

const cookieSettings = {domain: "localhost", maxAge: 9000000, httpOnly: false, signed:true, encode: String}


module.exports = { router }