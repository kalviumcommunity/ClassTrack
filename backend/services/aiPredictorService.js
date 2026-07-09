// backend/services/aiPredictorService.js
const OpenAI = require('openai');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Predicts attendance probability and risk factor for a student.
 * Falls back to a deterministic heuristic predictive model if no OpenAI key is set.
 */
const predictStudentRisk = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Get attendance records sorted by date ascending
    const records = await Attendance.find({ studentId }).sort({ date: 1 }).lean();

    const totalClasses = records.length;
    if (totalClasses < 3) {
      return {
        studentName: student.name,
        rollNumber: student.rollNumber,
        totalClasses,
        attendanceRate: totalClasses > 0 ? (records.filter(r => r.status === 'Present').length / totalClasses) * 100 : 100,
        riskLevel: 'Low Risk',
        predictedNextPresence: 90,
        trendStatus: 'Stable',
        insights: 'Insufficient attendance data to perform deep AI trend analysis. Require at least 3 classes marked.',
        recommendations: ['Continue monitoring student attendance as classes progress.'],
        powered_by: 'local-heuristic'
      };
    }

    const presentCount = records.filter(r => r.status === 'Present').length;
    const lateCount = records.filter(r => r.status === 'Late').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;

    // Numerical stats
    const attendanceRate = ((presentCount + (lateCount * 0.5)) / totalClasses) * 100;

    // Trend analysis (compare last 5 classes to previous classes)
    const recentRecords = records.slice(-5);
    const recentPresent = recentRecords.filter(r => r.status === 'Present').length + (recentRecords.filter(r => r.status === 'Late').length * 0.5);
    const recentRate = (recentPresent / recentRecords.length) * 100;

    const olderRecords = records.slice(0, -5);
    const olderRate = olderRecords.length > 0
      ? ((olderRecords.filter(r => r.status === 'Present').length + (olderRecords.filter(r => r.status === 'Late').length * 0.5)) / olderRecords.length) * 100
      : attendanceRate;

    let trendStatus = 'Stable';
    if (recentRate - olderRate < -10) {
      trendStatus = 'Declining';
    } else if (recentRate - olderRate > 10) {
      trendStatus = 'Improving';
    }

    // Pattern analysis (Weekday absences)
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const absentDays = records.filter(r => r.status === 'Absent').map(r => weekdays[new Date(r.date).getDay()]);
    
    // Count occurrences of each day
    const dayCounts = {};
    absentDays.forEach(day => {
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    let patternInsight = '';
    const topAbsentDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b, null);
    if (topAbsentDay && dayCounts[topAbsentDay] >= 2) {
      patternInsight = `Student shows a pattern of recurring absences on ${topAbsentDay}s.`;
    }

    // Fallback/Local Heuristic prediction logic
    let predictedNextPresence = attendanceRate;
    if (trendStatus === 'Declining') predictedNextPresence -= 15;
    if (trendStatus === 'Improving') predictedNextPresence += 10;
    if (records[records.length - 1].status === 'Absent') predictedNextPresence -= 10; // penalty for recent absence
    predictedNextPresence = Math.max(5, Math.min(99, Math.round(predictedNextPresence)));

    let riskLevel = 'Low Risk';
    if (predictedNextPresence < 75) {
      riskLevel = 'High Risk';
    } else if (predictedNextPresence < 85) {
      riskLevel = 'Moderate Risk';
    }

    // If OpenAI is available, generate rich semantic summary and diagnostic recommendations
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI academic advisor diagnosing student attendance risks. Analyze the metrics and return insights and recommendations.'
            },
            {
              role: 'user',
              content: `
                Student: ${student.name}
                Roll Number: ${student.rollNumber}
                Department: ${student.department}
                Total Classes: ${totalClasses}
                Overall Attendance Rate: ${attendanceRate.toFixed(1)}%
                Recent Trend: ${trendStatus} (Recent rate: ${recentRate.toFixed(1)}%, Older rate: ${olderRate.toFixed(1)}%)
                Absence Pattern: ${patternInsight || 'None detected'}
                Consecutive Absences at tail: ${records[records.length - 1].status === 'Absent' ? 'Yes' : 'No'}
                
                Please generate:
                1. A summary of insights explaining their risk profile.
                2. Three bulleted intervention recommendations (e.g. warning letters, counseling).
                Return JSON format: { "insights": "...", "recommendations": ["rec1", "rec2", "rec3"] }
              `
            }
          ],
          response_format: { type: 'json_object' }
        });

        const resultJson = JSON.parse(response.choices[0].message.content);
        return {
          studentName: student.name,
          rollNumber: student.rollNumber,
          totalClasses,
          attendanceRate: Math.round(attendanceRate),
          riskLevel,
          predictedNextPresence,
          trendStatus,
          insights: resultJson.insights,
          recommendations: resultJson.recommendations,
          powered_by: 'openai-gpt'
        };
      } catch (err) {
        console.error('OpenAI predictor error, using heuristic fallback:', err.message);
      }
    }

    // Heuristic Insights fallback generator
    let insights = `Overall attendance stands at ${Math.round(attendanceRate)}%. The short-term attendance trend is currently ${trendStatus.toLowerCase()}. `;
    if (patternInsight) insights += patternInsight;
    if (riskLevel === 'High Risk') {
      insights += ' High risk of falling below the minimum academic attendance requirement (75%). Immediate intervention suggested.';
    } else if (riskLevel === 'Moderate Risk') {
      insights += ' Moderate risk. Attendance is borderline. Monitor closely.';
    } else {
      insights += ' The student maintains a safe attendance level.';
    }

    const recommendations = [];
    if (riskLevel === 'High Risk') {
      recommendations.push('Send formal attendance warning letter to parents/guardians.');
      recommendations.push('Schedule mandatory meeting with the department counselor.');
      recommendations.push('Conduct academic review to verify student is not lagging in CSE/IT labs.');
    } else if (riskLevel === 'Moderate Risk') {
      recommendations.push('Inform class advisor to issue verbal warning.');
      recommendations.push('Monitor attendance during next 5 consecutive sessions.');
      recommendations.push('Provide peer study-group support to improve engagement.');
    } else {
      recommendations.push('Continue standard roster monitoring.');
      recommendations.push('Congratulate student for maintaining good academic stand.');
    }

    return {
      studentName: student.name,
      rollNumber: student.rollNumber,
      totalClasses,
      attendanceRate: Math.round(attendanceRate),
      riskLevel,
      predictedNextPresence,
      trendStatus,
      insights,
      recommendations,
      powered_by: 'local-heuristic'
    };

  } catch (error) {
    console.error('Prediction Service Error:', error);
    throw error;
  }
};

module.exports = { predictStudentRisk };