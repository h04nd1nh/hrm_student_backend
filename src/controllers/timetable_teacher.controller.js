const db = require("../models");
const config = require("../config/auth.config");
const moment = require("moment");
const User = db.user;
const { Op, transaction } = db.Sequelize;
const timeTableTeacher = db.timeTableTeacher;
const period = db.period;

exports.get_time_table_teacher = async (req, res) => {
    try {
        const userId = req.userId;
        const { day, month, year } = req.query;

        // Kiểm tra nếu thiếu thông tin bắt buộc
        if (!month || !year) {
            return res.status(400).json({ message: "Tháng và năm là bắt buộc" });
        }

        // Kiểm tra và chuyển đổi giá trị sang số
        const monthInt = parseInt(month, 10);
        const dayInt = day ? parseInt(day, 10) : null;
        const yearInt = parseInt(year, 10);

        // Xác thực các giá trị hợp lệ
        if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
            return res.status(400).json({
                success:false, 
                message: "Tháng không hợp lệ" 
            });
        }

        if (dayInt !== null && (isNaN(dayInt) || dayInt < 1 || dayInt > 31)) {
            return res.status(400).json({
                success:false, 
                message: "Ngày không hợp lệ" 
            });
        }

        if (isNaN(yearInt) || yearInt < 1) {
            return res.status(400).json({
                success:false, 
                message: "Năm không hợp lệ" 
            });
        }

        // Tạo điều kiện truy vấn động
        const startDate = new Date(yearInt, monthInt - 1, dayInt || 1); // Ngày bắt đầu
        const endDate = dayInt
            ? new Date(yearInt, monthInt - 1, dayInt + 1) // Nếu có ngày, kết thúc ở ngày tiếp theo
            : new Date(yearInt, monthInt, 1); // Nếu không, kết thúc ở đầu tháng tiếp theo

        const whereCondition = {
            teacher_id: userId,
            date: {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            },
        };

        // Tìm các bản ghi trong bảng timetableTeacher
        const records = await timeTableTeacher.findAll({ where: whereCondition });
        
        const formattedRecords = records.map((record) => {
            return {
                ...record.toJSON(),
                date: moment(record.date).format("DD-MM-YYYY"),
            };
        });
        // Trả kết quả
        return res.status(200).json({
            success: true,
            time_table: formattedRecords,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thời gian biểu:", error);
        return res.status(500).json({
            success:false,
            message: "Lỗi máy chủ" 
        });
    }
};

exports.get_current_time_table = async (req, res) => {
    try {
        const userId = req.userId;
        const currentPeriodId = await period.getCurrentPeriod();

        if (!currentPeriodId) {
            return res.status(404).json({
                success: false,
                message: "Không có lớp học nào trong khoảng thời gian hiện tại",
            });
        }

        // Lấy ngày hiện tại
        const currentDate = moment().startOf("day").toDate();

        // Tìm timetable với period_id và date
        const currentTimetable = await timeTableTeacher.getCurrentClass(currentPeriodId, currentDate, userId);

        if (!currentTimetable) {
            return res.status(200).json({
                success: false,
                message: "Hiện tại không có lớp học nào",
            });
        }

        return res.status(200).json({
            success: true,
            data: currentTimetable,
        });
    } catch (error) {
        console.error("Error in get_current_time_table:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
        });
    }
};



