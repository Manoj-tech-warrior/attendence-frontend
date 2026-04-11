import apiClient from './apiClient';

const ATTENDANCE_PATH = '/attendance';

export const fetchAttendanceRecords = async (date, month) => {
  try {
    const params = {};
    if (date) params.date = date;
    if (month) params.month = month;
    
    const response = await apiClient.get(ATTENDANCE_PATH, { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Punch In
export const punchIn = async (payload) => {
  try {
    const response = await apiClient.post(`${ATTENDANCE_PATH}/punch-in`, payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Punch Out
export const punchOut = async (payload) => {
  try {
    const response = await apiClient.post(`${ATTENDANCE_PATH}/punch-out`, payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Admin: Add attendance record
export const addAttendanceRecord = async (attendanceData) => {
  try {
    const response = await apiClient.post(`${ATTENDANCE_PATH}/admin/add`, attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Admin: Update attendance record
export const updateAttendanceRecord = async (id, attendanceData) => {
  try {
    const response = await apiClient.put(`${ATTENDANCE_PATH}/admin/${id}`, attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Admin: Delete attendance record
export const deleteAttendanceRecord = async (id) => {
  try {
    const response = await apiClient.delete(`${ATTENDANCE_PATH}/admin/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const markAttendance = async (userId, date, status) => {
  try {
    const response = await apiClient.post(ATTENDANCE_PATH, { userId, date, status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchAttendanceByDate = async (userId, date) => {
  try {
    const response = await apiClient.get(`${ATTENDANCE_PATH}/date`, {
      params: { userId, date },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

