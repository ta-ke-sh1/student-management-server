const { getFirestore } = require("firebase-admin/firestore");
const constants = require("../utils/constants");
const { snapshotToArray, fetchMatchingDataByField, addData } = require("./firebaseRepository");
const Utils = require("../utils/utils");

const db = getFirestore();

module.exports = class RoomRepository {
  async fetchAllRooms() {
    const snapshots = await db.collection(constants.ROOMS_TABLE).get();
    return snapshotToArray(snapshots);
  }

  async fetchRoomByIdAndDateAndSlot(room_id, date, slot) {
    const snapshot = await db.collection(constants.SCHEDULE_SLOTS_TABLE).where("room_id", "==", room_id).where("date", "==", date).where("slot", "==", slot).get();
    return snapshotToArray(snapshot);
  }

  async fetchRoomByCampusAndDateAndSlot(campus, date, slot) {
    const snapshot = await db.collection(constants.SCHEDULE_SLOTS_TABLE).where("campus", "==", campus).where("date", "==", date).where("slot", "==", slot).get();
    return snapshotToArray(snapshot);
  }

  async cascadeDeleleRoomByCampus(campus) {
    const batch = db.batch();
    let rooms = await fetchMatchingDataByField(constants.ROOMS_TABLE, "campus", campus);

    if (rooms.length > 0) {
      rooms.forEach(async (room) => {
        batch.delete(db.collection(constants.ROOMS_TABLE).doc(room.id));

        let slots = await fetchMatchingDataByField(constants.SCHEDULE_SLOTS_TABLE, "room_id", room.id);

        if (slots.length > 0) {
          slots.forEach((slot) => {
            batch.delete(db.collection(constants.SCHEDULE_SLOTS_TABLE).doc(slot.id));
          });
        }
      });
      await batch.commit();
    }
  }

  async bookRoom(data) {
    let r = await this.fetchRoomByCampusAndDateAndSlot(data.room_id, data.date, data.slot);

    if (r.length > 0) {
      return {
        error: "Error: This room already booked",
      };
    } else {
      return await addData(constants.SCHEDULE_SLOTS_TABLE, slot);
    }
  }
};
