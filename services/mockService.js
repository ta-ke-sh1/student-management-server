const { db } = require("../repository/firebaseRepository")
const Utils = require("../utils/utils")
const { uniqueNamesGenerator, names } = require('unique-names-generator');

const utils = new Utils()
module.exports = class MockService {

    async AddUser() {
        let departments = [
            "GDH", "GCH", "GBH", "GFH", "GMH"
        ]
        const batch = db.batch()
        for (let i = 1; i <= 200; i++) {

            let firstName = uniqueNamesGenerator({
                dictionaries: [names],
            })

            let lastName = uniqueNamesGenerator({
                dictionaries: [names],
            })

            let department = departments[utils.randomIntWithinRange(0, 4)]

            let user = {
                id: (200000 + i).toString(),
                role: utils.randomIntWithinRange(1, 2),
                firstName: firstName,
                lastName: lastName,
                dob: utils.randomIntWithinRange(1990, 2002) + "-" + utils.randomIntWithinRange(1, 12) + "-" + utils.randomIntWithinRange(1, 29),
                phone: "+84 " + utils.randomIntWithinRange(90, 99) + "" + utils.randomIntWithinRange(1, 9) + " " + utils.randomIntWithinRange(100, 900) + " " + utils.randomIntWithinRange(100, 900),
                status: "activated",
                department_id: department,
                email: (firstName + lastName[0] + department.toUpperCase() + (200000 + i) + "@fpt.edu.vn").toLowerCase(),
                password: "",
            }

            const ref = db.collection("Users").doc(user.id)

            batch.set(ref, user)

            console.log(user)
        }

        await batch.commit();
    }

    async AddRoom() {

        const batch = db.batch()

        for (let i = 1; i <= 4; i++) {
            for (let j = 0; j < 20; j++) {
                let index = i * 100 + j;
                const ref = db.collection("Rooms").doc("Room-HN-" + index)
                batch.set(ref, {
                    room: index.toString(),
                    building: "Pham Van Bach",
                    campus: "HN"
                })
            }
        }

        for (let i = 1; i <= 3; i++) {
            for (let j = 0; j < 20; j++) {
                let index = i * 100 + j;
                const ref = db.collection("Rooms").doc("Room-HCM-A-" + index)
                batch.set(ref, {
                    room: index.toString(),
                    building: "Block A",
                    campus: "HCM"
                })
            }
        }

        for (let i = 1; i <= 4; i++) {
            for (let j = 0; j < 10; j++) {
                let index = i * 100 + j;
                const ref = db.collection("Rooms").doc("Room-HCM-B-" + index)
                batch.set(ref, {
                    room: index.toString(),
                    building: "Block B",
                    campus: "HCM"
                })
            }
        }

        await batch.commit();
    }

    ClearMock() {

    }
}