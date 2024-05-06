const FeedbackRepository = require("../repository/feedbackRepository");
const {
    fetchDataById,
    addData,
    updateData,
    setData,
} = require("../repository/firebaseRepository");
const constants = require("../utils/constants");
const Utils = require("../utils/utils");
const CourseService = require("./courseService");

const utils = new Utils();

const FeedbackService = class {
    feedbackRepository;

    constructor() {
        this.feedbackRepository = new FeedbackRepository();
    }

    async fetchAllFeedback() {
        const feedbackes = await this.feedbackRepository.fetchFeedbacks();
        return feedbackes;
    }

    async editFeedback(feedback_id, comment) {
        const res = await updateData(
            constants.FEEDBACK_TABLE,
            feedback_id,
            {
                comments: comment
            }
        );
        return res;
    }

    async deleteFeedback(feedback_id) {
        const res = await this.feedbackRepository.deleteHardFeedback(
            feedback_id
        );
        return res;
    }

    async fetchFeedbackByCourse(course_id, lecturer_id) {
        let courseService = new CourseService();
        let participants = await courseService.fetchParticipantsByCourseId(course_id);
        console.log(participants)

        let feedbacks = await this.feedbackRepository.fetchFeedbackByCourse(
            course_id,
            lecturer_id
        );

        let res = []


        for (let i = 0; i < participants.length; i++) {
            let feedback = feedbacks.find((f) => f.student_id === participants[i].student_id)
            console.log(feedback)
            if (feedback) {
                res.push(feedback)
            } else {
                res.push({
                    student_id: participants[i].student_id
                })
            }
        }

        return res
    }

    async addFeedback(data) {
        const res = await setData(
            constants.FEEDBACK_TABLE,
            "Feedback-" + data.course_id + "-" + data.student_id,
            data
        );
        return res;
    }

    async fetchFeedbackById(Feedback_id) {
        if (!Feedback_id) {
            throw "Invalid Feedback id!";
        }
        let feedback = await fetchDataById(
            constants.FEEDBACK_TABLE,
            Feedback_id
        );
        if (feedback === -1) {
            throw "Feedback does not exist";
        }
        return feedback;
    }
};

module.exports = FeedbackService;
