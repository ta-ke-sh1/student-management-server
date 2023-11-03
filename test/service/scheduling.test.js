const { ScheduleService } = require("../../services/schedulingService");

const scheduleService = new ScheduleService();
describe("createSchedulesUsingDayAndSlotAndStartAndEndDate", () => {
  it("should create schedules within the date range and not exceed max slots", async () => {
    const slot = [
      { number: 1, slot: "morning" },
      { number: 3, slot: "afternoon" },
    ];
    const startDate = "2023-01-01";
    const endDate = "2023-01-10";
    const maxSlots = 5;

    const result = await scheduleService.createSchedulesUsingDayAndSlotAndStartAndEndDate(slot, startDate, endDate, maxSlots);

    expect(result.length).toBe(maxSlots);
    result.forEach((schedule) => {
      expect(schedule.date).toBeGreaterThanOrEqual(new Date(startDate).getTime());
      expect(schedule.date).toBeLessThanOrEqual(new Date(endDate).getTime());
      expect(slot.some((s) => s.slot === schedule.slot)).toBe(true);
    });
  });

  it("should create schedules within the date range if max slots is greater than the number of days", async () => {
    const slot = [
      { number: 1, slot: "morning" },
      { number: 3, slot: "afternoon" },
    ];
    const startDate = "2023-01-01";
    const endDate = "2023-01-10";
    const maxSlots = 20;

    const result = await scheduleService.createSchedulesUsingDayAndSlotAndStartAndEndDate(slot, startDate, endDate, maxSlots);

    expect(result.length).toBeLessThan(maxSlots);
    result.forEach((schedule) => {
      expect(schedule.date).toBeGreaterThanOrEqual(new Date(startDate).getTime());
      expect(schedule.date).toBeLessThanOrEqual(new Date(endDate).getTime());
      expect(slot.some((s) => s.slot === schedule.slot)).toBe(true);
    });
  });

  it("should return an empty array if start date is after end date", async () => {
    const slot = [
      { number: 1, slot: "morning" },
      { number: 3, slot: "afternoon" },
    ];
    const startDate = "2023-01-10";
    const endDate = "2023-01-01";
    const maxSlots = 5;

    const result = await scheduleService.createSchedulesUsingDayAndSlotAndStartAndEndDate(slot, startDate, endDate, maxSlots);

    expect(result).toEqual([]);
  });
});

describe("fetchScheduleByStudentIdAndDate", () => {
  it("should fetch schedules if all parameters are provided", async () => {
    const query = {
      user_id: "1",
      startDate: "2023-01-01",
      endDate: "2023-01-10",
      course_id: "course1%course2%",
    };
    const data1 = ["schedule1", "schedule2"];
    const data2 = ["schedule3", "schedule4"];

    scheduleService.scheduleRepository.fetchScheduleByStudentIdAndCourseIdAndDate.mockImplementationOnce(() => Promise.resolve(data1)).mockImplementationOnce(() => Promise.resolve(data2));

    const result = await scheduleService.fetchScheduleByStudentIdAndDate(query);

    expect(yourModule.scheduleRepository.fetchScheduleByStudentIdAndCourseIdAndDate).toHaveBeenNthCalledWith(1, query.user_id, "course1", query.startDate, query.endDate);
    expect(yourModule.scheduleRepository.fetchScheduleByStudentIdAndCourseIdAndDate).toHaveBeenNthCalledWith(2, query.user_id, "course2", query.startDate, query.endDate);
    expect(result).toEqual([...data1, ...data2]);
  });

  it("should throw error if any parameter is missing", async () => {
    const query = {
      user_id: "1",
      startDate: "2023-01-01",
      endDate: "2023-01-10",
    };

    await expect(scheduleService.fetchScheduleByStudentIdAndDate(query)).rejects.toThrow("Missing parameters");
  });
});
