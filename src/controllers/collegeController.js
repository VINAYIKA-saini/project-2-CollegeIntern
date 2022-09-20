const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const isValid = require("../dataValidation/createCollegeValidator")



//========================================>  (( Create College api call )) <=================================================//

const createCollege = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {

        let data = req.body
         //------------------------> (If DON'T have any object in body) <------------------------------//
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Body should not be empty" })
        }

        let { name, fullName, logoLink } = data
         //------------------------> (If College name already exists) <------------------------------//
        let checkName = await collegeModel.findOne({ name })
        if (checkName) {
            return res.status(404).send({ status: false, message: "collge name already exists." })
        }
         //------------------------> (Name data validation) <------------------------------//
        let msgName = isValid.isValidName(name)
        if (msgName) {
            return res.status(400).send({ status: false, message: msgName })
        }
         //------------------------> (Full name validation) <------------------------------//
        let msgfullName = isValid.isValidfullName(fullName)
        if (msgfullName) {
            return res.status(400).send({ status: false, message: msgfullName })
        }
         //------------------------> (logo link validation) <------------------------------//
        let msgLogoLink = isValid.isValidLogoLink(logoLink)
        if (msgLogoLink) {
            return res.status(400).send({ status: false, message: msgLogoLink })
        }
         //------------------------> (College created) <------------------------------//
         await collegeModel.create(data)
        let savedData = {
            "name" : name,
            "fullName" :fullName,
            "logoLink" : logoLink,
            "isDeleted" : false
        }
        return res.status(201).send({ status: true, msg: "Data successfully created" ,data: savedData })
         //------------------------> (END API) <------------------------------//

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


//========================================>  (( Gwt Data College api call )) <=================================================//


const getCollege = async function (req, res) {
   res.setHeader('Access-Control-Allow-Origin','*')
    try {

        let collegeName = req.query.collegeName
        //------------------------> (If DON'T have any object in body) <------------------------------//
        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, message: "query is required" })
        }
        //------------------------> (If college data not found by college name) <------------------------------//
        let College = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!College) {
            return res.status(404).send({ status: false, message: "college Name not found" })
        }
        //------------------------> (Interns data find by particular college object Id) <------------------------------//

        let ID = College._id
        let interns = await internModel.find({ collegeId: ID, isDeleted: false}).select({_id:1, name:1, email:1, mobile:1})

        //------------------------> (Send data format) <------------------------------//
        let {name, fullName, logoLink} = College
        let savedData = {
            "name":name ,
            "fullName":fullName ,
            "logoLink":logoLink ,
            "interns" : interns
        }
        return res.status(200).send({ status: true, data: savedData })

        //------------------------> (END API) <------------------------------//

    }catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = {createCollege, getCollege}