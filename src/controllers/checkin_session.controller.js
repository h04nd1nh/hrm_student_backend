const db = require("../models");
const config = require("../config/auth.config");
const moment = require("moment");
const User = db.user;
const { Op, transaction } = db.Sequelize;
const timeTableTeacher = db.timeTableTeacher;
const timeTable = db.timeTable;
const checkinSession = db.checkinSession;
const Period = db.period;  // Đổi tên biến `period` thành `Period` ở đây

exports.create_checkin_session = async (req, res) => {
    try {
        const userId = req.userId;
        const { time_table_teacher_id} = req.body;

        const whereCondition = {
            teacher_id: userId,
            id: time_table_teacher_id,
        };

        // Tìm các bản ghi trong bảng timetable
        const timeTable = await timeTableTeacher.findOne({ where: whereCondition });

        // Tìm thông tin về period
        const period = await Period.findOne({ where: { id: timeTable.period_id } });  // Sử dụng `Period` thay vì `period`

        // Kiểm tra ngày hiện tại có trùng với ngày timeTable.date hay không
        const currentDate = moment().startOf('day'); // Lấy ngày hiện tại không có giờ
        const timeTableDate = moment(timeTable.date).startOf('day'); // Lấy ngày của timeTable không có giờ

        // Kiểm tra thời gian hiện tại có nằm trong khoảng period.start_time và period.end_time không
        const currentTime = moment(); // Thời gian hiện tại
        const startTime = moment(period.start_time); // Thời gian bắt đầu của period
        const endTime = moment(period.end_time); // Thời gian kết thúc của period

        // Kiểm tra điều kiện
        if (currentDate.isSame(timeTableDate) && currentTime.isBetween(startTime, endTime, null, '[]')) {
            const newCheckinSession = await checkinSession.create({
                timetable_id: timeTable.id,  // Lưu id của timeTableTeacher
                start_time: currentTime.format("HH:mm:ss")  // Lưu thời gian hiện tại
            });

            return res.status(200).json({
                success: true,
                message: "Tạo phiên check-in thành công.",
                // data: newCheckinSession  // Trả về thông tin phiên check-in mới
            });
        } else {
            return res.status(400).json({
                success: false,
            });
        }

    } catch (error) {
        console.error("Lỗi khi lấy thời gian biểu:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ" 
        });
    }
};

exports.get_checkin = async (req, res) => {
    try {
        const userId = req.userId;
        const { time_table_teacher_id } = req.query;

        const checkinSession = await checkinSession.findOne({ where: {
            timetable_id: time_table_teacher_id,
        }});
        
        if (!checkinSession) {
            return res.status(404).json({
                success: false,
                message: "Chưa có phiên điểm danh của lớp học này",
            });
        } else {
            return res.status(200).json({
                success: true,
                session: checkinSession,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ" 
        });
    }
};

exports.checkin = async (req, res) => {
    try {
        const userId = req.userId;
        const { session_id } = req.params;

        const checkin = await checkinSession.findOne({ where: {
            id: session_id,
        } });
        
        
        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phiên điểm danh",
            });
        }

        // Lấy giá trị start_time từ cơ sở dữ liệu và thời điểm hiện tại
        const startTime = moment(checkin.start_time, "HH:mm:ss"); // Chuyển đổi sang moment
        const currentTime = moment(); // Thời điểm hiện tại

        // Tính toán khoảng cách thời gian (theo phút)
        const timeDifference = currentTime.diff(startTime, "minutes");

        // Kiểm tra nếu khoảng cách quá 15 phút
        if (timeDifference > 15) {
            return res.status(400).json({
                success: false,
                message: "Đã quá thời hạn để điểm danh",
            });
        } 

        const updatedRows = await timeTable.update(
            { is_checkin: true }, // Giá trị cần cập nhật
            {
                where: {
                    student_id: userId, // User ID của sinh viên
                    time_table_teacher_id: checkin.timetable_id, // ID trong bảng timetable
                },
            }
        );

        if (updatedRows[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy dữ liệu để cập nhật.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Điểm danh thành công",
        });

    } catch (error) {
        console.error("Lỗi khi lấy thời gian biểu:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ" 
        });
    }
};
