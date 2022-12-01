import Calendar from "../models/Calendar.js";

export const createMainCalendar = async (user) => {
  try {
    const calendars = await Calendar.find({ author: user.id });
    if (calendars.length < 1) {
      const newCalendar = new Calendar({
        name: "Main Calendar",
        members: user.id,
        icon: "https://cdn-icons-png.flaticon.com/512/4206/4206324.png",
        author: user.id,
        type: "main",
      });
      await newCalendar.save();
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Creating calendar error" });
  }
};
