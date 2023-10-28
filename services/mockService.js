const { db } = require("../repository/firebaseRepository")
const Utils = require("../utils/utils")
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const constants = require("../utils/constants");

const utils = new Utils()
module.exports = class MockService {

    async AddRegistration() {

        const batch = db.batch()

        let semester = "Spring"
        let year = "2023"
        let subjects = ['1618', '1619', '1622', '1633', '1690', '1644', '1649', '1641', '1647']


        for (let i = 0; i < subjects.length; i++) {

        }

        await batch.commit();
    }

    async AddUser() {
        let departments = [
            "GDH", "GCH", "GBH", "GFH", "GMH"
        ]

        let table = [constants.STUDENTS_TABLE, constants.STUDENTS_TABLE, constants.LECTURERS_TABLE]
        const batch = db.batch()
        for (let i = 1; i <= 30; i++) {

            let firstName = uniqueNamesGenerator({
                dictionaries: [names],
            })

            let lastName = uniqueNamesGenerator({
                dictionaries: [names],
            })

            let department = departments[utils.randomIntWithinRange(0, 4)]

            let user = {
                firstName: firstName,
                lastName: lastName,
                dob: utils.randomIntWithinRange(1990, 2002) + "-" + utils.randomIntWithinRange(1, 12) + "-" + utils.randomIntWithinRange(1, 29),
                phone: "+84 " + utils.randomIntWithinRange(90, 99) + "" + utils.randomIntWithinRange(1, 9) + " " + utils.randomIntWithinRange(100, 900) + " " + utils.randomIntWithinRange(100, 900),
                status: "activated",
                department_id: department,
                email: (firstName + lastName[0] + department.toUpperCase() + (200000 + i) + "@fpt.edu.vn").toLowerCase(),
                password: "",
                status: true,
            }

            const ref = db.collection(table[utils.randomIntWithinRange(0, 2)]).doc((firstName + lastName[0]).toLowerCase())
            await ref.set(user)

            console.log(user)
        }

        await batch.commit();
    }

    async AddGroup() {
        const programmes = ['ENG', "F2G", "SC", "UOG"]
        const semesters = ["SU", "FA", "SP"]
        const years = ["23", "22", "21", "20"]
        const departments = [
            "GDH", "GCH", "GBH"
        ]

        const gch_lecturers = ["tungdt", "longntd", "chuvm", "anniec"]
        const gbh_lecturers = ["ashleen", "frediaf", "katrinkac"]
        const gdh_lecturers = ["tatianiam", "anabella", "yness"]

        const gch_subject = ["1631", "1651", "1644", "1649", "1633", "1690", "1625", "1639", "1641", "1670", "COMP1682", "COMP1649", "COMP1786", "COMP1787", "COMP1640"]
        const gbh_subject = ["491", "736", "525", "570", "495", "522", "574", "528", "529", "BUSI0011", "BUSI1323", "BUSI1334"]
        const gdh_subject = ["3512", "3541", "3513", "3515", "3524", "3532", "3514", "3525", "DESI1219", "DESI1226", "DESI1221", "DESI1222"]


        for (let i = 10; i < 60; i++) {
            const programme = departments[utils.randomIntWithinRange(0, 2)]
            const group = {
                lecturer: programme == "GDH" ? gdh_lecturers[utils.randomIntWithinRange(0, gdh_lecturers.length - 1)] : programme === "GCH" ? gch_lecturers[utils.randomIntWithinRange(0, gch_lecturers.length - 1)] : gbh_lecturers[utils.randomIntWithinRange(0, gbh_lecturers.length - 1)],
                status: true,
                slots: utils.randomIntWithinRange(20, 42),
                subject: programme == "GDH" ? gdh_subject[utils.randomIntWithinRange(0, gdh_subject.length - 1)] : programme === "GCH" ? gch_subject[utils.randomIntWithinRange(0, gch_subject.length - 1)] : gbh_subject[utils.randomIntWithinRange(0, gbh_subject.length - 1)]
            }
            const docRef = programme + "20" + i.toString()

            db.collection(constants.CLASS_TABLE).add({
                name: docRef,
                ...group,
                programme: programmes[utils.randomIntWithinRange(0, 3)],
                term: semesters[utils.randomIntWithinRange(0, 2)] + "-" + years[utils.randomIntWithinRange(0, 3)],
                department: programme
            })
        }

    }

    async AddSchedule() {

    }

    async AddGrades() {

    }

    async AddRoom() {

        const batch = db.batch()

        let capacity = [40, 50, 30, 100]

        for (let i = 1; i <= 4; i++) {
            for (let j = 0; j < 20; j++) {
                let index = i * 100 + j;
                const ref = db.collection("Rooms").doc("Room-HN-" + index)
                batch.set(ref, {
                    room: index.toString(),
                    building: "Pham Van Bach",
                    campus: "HN",
                    capacity: capacity[utils.randomIntWithinRange(0, 3)]
                })
            }
        }

        await batch.commit();
    }

    ClearMock() {

    }
}