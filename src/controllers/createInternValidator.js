const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const isValid = require("../dataValidation/internCreatValidation")



//===========================================> (Create Intern api) <================================================//

const createIntern = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {

        let data = req.body
        //------------------------> (If DON'T have any object in body) <------------------------------//
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }
        //------------------------> (Intern name validation) <------------------------------//
        let { name, mobile, email, collegeName } = data

        let msgName = isValid.isValidsName(name)
        if (msgName) {
            return res.status(400).send({ status: false, message: msgName })
        }
        //------------------------> (Mobile number validation) <------------------------------//
        let msgMobile = isValid.isValidMobile(mobile)
        if (msgMobile) {
            return res.status(400).send({ status: false, message: msgMobile })
        }
        //------------------------> (Mobile number uniqe validation) <------------------------------//
        let checkMobile = await internModel.findOne({ mobile })
        if (checkMobile) {
            return res.status(404).send({ status: false, message: "mobile number already exists." })
        }
        //------------------------> (email Id validation) <---------------------------------------//
        let msgEmail = isValid.isValidEmail(email)
        if (msgEmail) {
            return res.status(400).send({ status: false, message: msgEmail })
        }
        //------------------------> (Email id uniqe validation) <----------------------------------//
        let checkEmail = await internModel.findOne({ email })
        if (checkEmail) {
            return res.status(404).send({ status: false, message: "email already exists." })
        }
        //------------------------> (college name validation) <--------------------------------------//
        let msgCollegeName = isValid.isValidcollegeName(collegeName)
        if (msgCollegeName) {
            return res.status(400).send({ status: false, message: msgCollegeName })
        }
        //------------------------> (Find college Object Id by college name) <------------------------//
        let collegeData = await collegeModel.findOne({ name: collegeName })
        if (!collegeData) {
            return res.status(400).send({ status: false, message: "Please enter valide college name" })
        }
        let collegeId = collegeData._id
        //------------------------> (Data format for stor database) <--------------------------------//
        let savedData1 = {
            name, email, mobile, collegeId
        }
        //------------------------> (Interrn data creat) <------------------------------------------//
        await internModel.create(savedData1)
        let data1 = {
            "isDeleted": false,
            "name": name,
            "email": email,
            "mobile": mobile,
            "collegeId": collegeId
        }
        return res.status(201).send({ status: true, message: "Data successfully created", data: data1 })
        //------------------------> (END API) <------------------------------//
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createIntern }