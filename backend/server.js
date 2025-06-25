// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const Session = require('./models/Session');
const QuizResult = require('./models/QuizResult');
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://quiz-up-nine.vercel.app', // Vercel frontend domainin
  // başka domainler eklenebilir
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
app.use('/api/results', require('./routes/quizResultRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/uploads', express.static('uploads'));

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ===== SOCKET.IO LOGIC =====
const answerMap = {};
const scoreMap = {};
const studentNameMap = {};
const questionDuration = 10;

io.on('connection', (socket) => {
  console.log(`🔌 Bağlandı: ${socket.id}`);

  socket.on('teacher-join-lobby', (sessionId, teacherName) => {
    socket.join(sessionId);
    console.log(`👨‍🏫 Öğretmen ${teacherName} → ${sessionId} oturumuna katıldı.`);
  });

  socket.on('student-join-lobby', ({ sessionId, studentName }) => {
    socket.join(sessionId);
    studentNameMap[socket.id] = studentName;

    if (!scoreMap[sessionId]) scoreMap[sessionId] = {};
    scoreMap[sessionId][socket.id] = 0;
    
    io.to(sessionId).emit('student-joined', studentName);
    console.log(`👨‍🎓 Öğrenci ${studentName} → ${sessionId} oturumuna katıldı.`);
  });

  socket.on('submit-answer', ({ sessionId, answer }) => {
    if (!answerMap[sessionId]) answerMap[sessionId] = {};
    answerMap[sessionId][socket.id] = answer;
  });

  socket.on('start-quiz', async (sessionId) => {
    io.to(sessionId).emit('quiz-started');
    io.to(sessionId).emit('quiz-countdown', 5);
  
    setTimeout(async () => {
      const session = await Session.findById(sessionId).populate({
        path: 'quizId',
        populate: { path: 'createdBy', select: 'username' }
      });
  
      if (!session || !session.quizId || !session.quizId.questions) return;
  
      const questions = session.quizId.questions;
      let currentIndex = 0;
  
      const showNextQuestion = async () => {
        // Quiz bittiyse hiçbir zamanlayıcı başlatmadan çık
        if (currentIndex >= questions.length) {
          const finalScores = Object.entries(scoreMap[sessionId]).map(([sid, score]) => ({
            name: studentNameMap[sid] || 'Bilinmeyen',
            score,
            socketId: sid
          }));
        
          // Quiz ve Session bilgilerini DB'den al
          const session = await Session.findById(sessionId).populate({
            path: 'quizId',
            populate: { path: 'createdBy', select: 'username' }
          });
        
          if (session && session.quizId) {
            const totalQuestions = session.quizId.questions.length;
        
            for (const entry of finalScores) {
              await QuizResult.create({
                studentName: entry.name,
                sessionId: session._id,
                quizId: session.quizId._id,
                score: entry.score,
                totalQuestions
              });
            }
          }
        
          io.to(sessionId).emit('quiz-finished', {
            scores: finalScores.map(({ name, score }) => ({ name, score })),
            quizTitle: session.quizId.title,
            quizCreator: session.quizId.createdBy?.username || 'Bilinmiyor'
          });
          return;
        }
  
        const question = questions[currentIndex];
        answerMap[sessionId] = {};
  
        io.to(sessionId).emit('show-question', {
          questionText: question.question,
          optionA: question.options[0],
          optionB: question.options[1],
          optionC: question.options[2],
          optionD: question.options[3],
          mediaType: question.mediaType,
          mediaUrl: question.mediaUrl,
          index: currentIndex + 1,
          total: questions.length,
          remainingTime: questionDuration
        });
  
        setTimeout(() => {
          // Quiz bittiyse devam etme
          if (currentIndex >= questions.length) return;
          const stats = calculateStats(answerMap[sessionId], question.correctAnswer);
  
          io.to(sessionId).emit('show-answer', {
            correctOption: question.correctAnswer,
            answerStats: stats
          });
  
          Object.entries(answerMap[sessionId]).forEach(([sid, answer]) => {
            if (answer.toUpperCase() === question.correctAnswer.toUpperCase()) {
              scoreMap[sessionId][sid] += 100;
            }
          });
  
          setTimeout(() => {
            // Quiz bittiyse devam etme
            if (currentIndex >= questions.length) return;
            const scoreboard = Object.entries(scoreMap[sessionId]).map(([sid, score]) => ({
              name: studentNameMap[sid] || 'Bilinmeyen',
              score
            }));
  
            io.to(sessionId).emit('show-scoreboard', {
              scores: scoreboard,
              answerStats: stats
            });
  
            setTimeout(() => {
              // Quiz bittiyse devam etme
              if (currentIndex + 1 > questions.length) return;
              currentIndex++;
              if (currentIndex >= questions.length) {
                showNextQuestion(); 
                return;
              }
              io.to(sessionId).emit('next-question-countdown', 5);
              setTimeout(() => showNextQuestion(), 5000);
            }, 5000);
          }, 5000);
        }, 10000);
      };
  
      await showNextQuestion();
    }, 5000);
  });
  

  socket.on('disconnect', () => {
    console.log(`❌ Ayrıldı: ${socket.id}`);
  });
});

function calculateStats(answers, correctOption) {
  const total = Object.keys(answers).length;
  const count = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach(ans => {
    if (count[ans] !== undefined) count[ans]++;
  });
  const percent = {};
  for (let key in count) {
    percent[key] = total > 0 ? Math.round((count[key] / total) * 100) : 0;
  }
  return percent;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});